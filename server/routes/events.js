import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { db } from '../db/index.js';
import { events, registrations, users, societies, societyManagers } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { desc, eq, and, count, ilike, inArray } from 'drizzle-orm';

const router = express.Router();

// --- MULTER CONFIGURATION ---
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/banners/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadBanner = multer({ 
  storage: bannerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed!"));
    }
  }
});


// ==========================================
// 🟢 STATIC ROUTES (Must be above /:id)
// ==========================================

// 1. GET ALL EVENTS (Public Feed with Filtering)
router.get('/', async (req, res) => {
  const { category, q, societyId } = req.query;

  try {
    let query = db.select({
      id: events.id,
      title: events.title,
      banner: events.banner,
      startDate: events.startDate,
      location: events.location,
      eventType: events.eventType,
      shortDescription: events.shortDescription,
      societyId: events.societyId,
      societyName: societies.name,
      societyLogo: societies.logo
    })
    .from(events)
    .leftJoin(societies, eq(events.societyId, societies.id));

    const conditions = [];

    if (societyId) conditions.push(eq(events.societyId, parseInt(societyId)));
    if (category) conditions.push(ilike(events.eventType, category)); // Fixed to eventType
    if (q) conditions.push(ilike(events.title, `%${q}%`));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allEvents = await query.orderBy(desc(events.startDate || events.id));
    res.json(allEvents);
  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 2. GET USER'S REGISTRATIONS
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    const myEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate,
        location: events.location,
        banner: events.banner,
        eventType: events.eventType,
        shortDescription: events.shortDescription,
        attended: registrations.attended
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.userId, req.user.id))
      .orderBy(desc(events.startDate));
      
    res.json(myEvents);
  } catch (err) {
    console.error("Drizzle Select Error:", err);
    res.status(500).json({ error: "Could not fetch your schedule" });
  }
});

// 3. GET USER'S SCHEDULE (Alternative endpoint)
router.get('/my-schedule', authenticateToken, async (req, res) => {
  try {
    const myEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate,
        location: events.location
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.userId, req.user.id));

    res.json(myEvents);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch schedule" });
  }
});

// 4. GET ALL STATS FOR ORGANIZERS (Cofounder Fix Applied)
router.get('/organizer/all-stats', authenticateToken, async (req, res) => {
  try {
    const stats = await db
      .select({
        eventTitle: events.title,
        studentName: users.name,
        studentEmail: users.email,
        registrationDate: registrations.registeredAt 
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .innerJoin(societies, eq(events.societyId, societies.id))
      .innerJoin(users, eq(registrations.userId, users.id))
      .innerJoin(societyManagers, eq(societies.id, societyManagers.societyId))
      .where(eq(societyManagers.userId, req.user.id)); // Cofounders can see stats too

    res.json(stats);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch organizer stats" });
  }
});

// 🟢 FIX: MOVED UP SO IT DOESN'T CONFLICT WITH GET /:id
// GET EVENTS MANAGED BY THE CURRENT USER (For Attendance Center)
router.get('/organizer/my-events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // We find events where the user is either the creator 
    // OR they are a manager of the society hosting the event
    const managedEvents = await db.select({
      id: events.id,
      title: events.title,
      startDate: events.startDate,
      location: events.location,
      eventType: events.eventType,
      societyName: societies.name
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .innerJoin(societyManagers, eq(societies.id, societyManagers.societyId))
    .where(eq(societyManagers.userId, userId))
    .orderBy(desc(events.startDate));

    res.json(managedEvents);
  } catch (err) {
    console.error("Organizer Events Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch managed events." });
  }
});


// ==========================================
// 🔵 ACTION ROUTES (POST)
// ==========================================

// 5. CREATE EVENT (Cofounder Fix Applied)
router.post('/', authenticateToken, (req, res, next) => {
  uploadBanner.single('banner')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Max limit is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { 
    title, societyId, eventType, shortDescription, longDescription, 
    startDate, endDate, location, registrationDeadline, capacity 
  } = req.body;

  const bannerPath = req.file ? `/uploads/banners/${req.file.filename}` : null;

  try {
    // Cofounder Fix: Check the junction table, not just the ownerId
    const [isManager] = await db.select()
      .from(societyManagers)
      .where(and(
        eq(societyManagers.societyId, parseInt(societyId)),
        eq(societyManagers.userId, req.user.id)
      ));

    if (!isManager) {
      return res.status(403).json({ message: "Unauthorized: You do not manage this society." });
    }

    const [newEvent] = await db.insert(events).values({
      title,
      societyId: parseInt(societyId),
      banner: bannerPath,
      eventType,
      shortDescription,
      longDescription,
      startDate: new Date(startDate),
      endDate: endDate && endDate !== "null" ? new Date(endDate) : null,
      location,
      registrationDeadline: registrationDeadline && registrationDeadline !== "null" ? new Date(registrationDeadline) : null,
      capacity: capacity ? parseInt(capacity) : 100,
      createdBy: req.user.id 
    }).returning();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("EVENT ERROR:", err);
    res.status(500).json({ error: "Could not publish event. Check your fields." });
  }
});


// ==========================================
// 🟠 DYNAMIC ID ROUTES (Must be at the bottom)
// ==========================================

// 6. REGISTER FOR EVENT
router.post('/:id/register', authenticateToken, async (req, res) => {
  const eventId = Number(req.params.id);
  const userId = req.user.id;

  if (isNaN(eventId)) return res.status(400).json({ message: "Invalid Event ID" });

  try {
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    if (!event) return res.status(404).json({ message: "Event not found" });

    const [existing] = await db.select()
      .from(registrations)
      .where(and(eq(registrations.userId, userId), eq(registrations.eventId, eventId)));

    if (existing) return res.status(400).json({ message: "Already registered!" });

    if (event.capacity) {
      const [countRes] = await db.select({ value: count() })
        .from(registrations)
        .where(eq(registrations.eventId, eventId));

      if (Number(countRes?.value || 0) >= event.capacity) {
        return res.status(400).json({ message: "Event is full! Keep an eye out for more." });
      }
    }

    await db.insert(registrations).values({ userId, eventId });
    res.status(201).json({ message: "See you at the event!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 7. GET ATTENDEES (Cofounder Fix Applied)
router.get('/:id/attendees', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Cofounder Fix: Allow society managers OR the original event creator
    const [isManager] = await db.select()
      .from(societyManagers)
      .where(and(
        eq(societyManagers.societyId, event.societyId),
        eq(societyManagers.userId, req.user.id)
      ));

    if (!isManager && event.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You do not manage this event." });
    }

    const attendeeList = await db
      .select({
        userId: users.id,                 // 🔥 FIX: Added so frontend knows the ID
        studentName: users.name,
        studentEmail: users.email,
        registeredAt: registrations.registeredAt,
        attended: registrations.attended  // 🔥 FIX: Added so UI shows present/absent
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id))
      .where(eq(registrations.eventId, eventId));

    res.json(attendeeList);
  } catch (err) {
    console.error("Error fetching attendees:", err);
    res.status(500).json({ error: "Could not fetch attendee list" });
  }
});

// 🟢 FIX: MOVED TOGGLE ROUTE NEXT TO GET ATTENDEES
// TOGGLE ATTENDANCE (Cofounder Fix Applied)
router.patch('/:eventId/attendees/:userId/check-in', authenticateToken, async (req, res) => {
  const { eventId, userId } = req.params;
  const { status } = req.body; // Expecting true or false

  try {
    const [event] = await db.select().from(events).where(eq(events.id, Number(eventId)));
    
    // Security: Only managers can check people in
    const [isManager] = await db.select().from(societyManagers)
      .where(and(
        eq(societyManagers.societyId, event.societyId),
        eq(societyManagers.userId, req.user.id)
      ));

    if (!isManager) return res.status(403).json({ error: "Unauthorized" });

    await db.update(registrations)
      .set({ attended: status })
      .where(and(
        eq(registrations.eventId, Number(eventId)),
        eq(registrations.userId, Number(userId))
      ));

    res.json({ message: `Attendance marked as ${status ? 'Present' : 'Absent'}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update attendance." });
  }
});
// GET /api/events/certificate/:eventId
router.get('/certificate/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    // req.user is now available thanks to your authenticateToken middleware
    const userId = req.user.id; 

    // 1. Fetch registration details and verify attendance
    const result = await db
      .select({
        userName: users.name,
        eventTitle: events.title,
        societyName: events.societyName,
        registrationId: registrations.id,
        updatedAt: registrations.updatedAt,
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id))
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.userId, userId),
          eq(registrations.attended, true)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return res.status(403).json({ message: "Attendance not verified." });
    }

    const data = result[0];

    // 2. Fetch the Society to get the Dynamic College Name and Logo
    const societyData = await db
      .select()
      .from(societies)
      .where(eq(societies.name, data.societyName))
      .limit(1);

    const society = societyData[0];

    // 3. Send dynamic payload to frontend
    res.json({
      userName: data.userName,
      eventName: data.eventTitle,
      societyName: data.societyName,
      societyLogo: society?.logo || null,
      collegeName: society?.collegeName || "Authorized Institution", // Dynamic from your schema
      issueDate: data.updatedAt,
      certId: `HUB-${data.registrationId.toString().slice(-8).toUpperCase()}`
    });

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// 8. GET SINGLE EVENT
router.get('/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id); 
    if (isNaN(eventId)) return res.status(400).json({ error: "Invalid Event ID" });

    const data = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId))
    .limit(1);

    if (data.length === 0) return res.status(404).json({ error: "Event not found" });

    res.json(data[0]);
  } catch (err) {
    console.error("Performance Error:", err);
    res.status(500).json({ error: "Database timeout" });
  }
});

// 9. UPDATE EVENT (Cofounder Fix Applied)
router.put('/:id', authenticateToken, (req, res, next) => {
  uploadBanner.single('banner')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { 
    title, eventType, location, capacity, 
    startDate, endDate, registrationDeadline, 
    shortDescription, longDescription 
  } = req.body;

  const parseDate = (d) => (d && d !== "null" && d !== "") ? new Date(d) : null;

  try {
    const [eventData] = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId));

    if (!eventData) return res.status(404).json({ error: "Event not found." });

    // Cofounder Fix: Allow society managers OR the original event creator
    const [isManager] = await db.select()
      .from(societyManagers)
      .where(and(
        eq(societyManagers.societyId, eventData.event.societyId),
        eq(societyManagers.userId, req.user.id)
      ));

    if (!isManager && Number(eventData.event.createdBy) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Unauthorized: You don't manage this event." });
    }

    const updateData = {
      title, 
      eventType, 
      location, 
      shortDescription,
      longDescription,
      capacity: parseInt(capacity) || 100,
      startDate: new Date(startDate),
      endDate: parseDate(endDate),
      registrationDeadline: parseDate(registrationDeadline)
    };
    
    if (req.file) updateData.banner = `/uploads/banners/${req.file.filename}`;

    const [updatedEvent] = await db.update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning();

    res.json(updatedEvent);
  } catch (err) {
    console.error("🔥 PUT /api/events/:id ERROR:", err);
    res.status(500).json({ error: "Database error. Check terminal for details." });
  }
});

// 10. DELETE EVENT (Cofounder Fix Applied)
router.delete('/:id', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const [eventData] = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId));

    if (!eventData) return res.status(404).json({ message: "Event not found." });

    // Cofounder Fix: Allow society managers OR the original event creator
    const [isManager] = await db.select()
      .from(societyManagers)
      .where(and(
        eq(societyManagers.societyId, eventData.event.societyId),
        eq(societyManagers.userId, req.user.id)
      ));

    if (!isManager && Number(eventData.event.createdBy) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized. You do not have permission to delete this event." });
    }

    await db.delete(registrations).where(eq(registrations.eventId, eventId));
    await db.delete(events).where(eq(events.id, eventId));

    res.json({ message: "Event and all its registrations have been deleted." });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

export default router;