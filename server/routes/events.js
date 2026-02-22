import express from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db/index.js';
import { events } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { desc, eq, and, count } from 'drizzle-orm';
import { registrations, users, societies } from '../db/schema.js';
import multer from 'multer';
const router = express.Router();

// 1. Get all events (Public - for the Feed)
import { ilike } from 'drizzle-orm'; // Import ilike

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/banners/';
    // Automatically create directory if it doesn't exist to prevent 500 errors
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
  limits: { 
    fileSize: 10 * 1024 * 1024 // Increased to 10MB
  } ,
  fileFilter: (req, file, cb) => {
    // Define the allowed extensions and mimetypes
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      // Reject the file with a specific error message
      cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed!"));
    }
  }
});

// Updated Get all events (Public - with Search & Filtering)
// backend/routes/events.js

// backend/routes/events.js

router.get('/', async (req, res) => {
  const { category, q, societyId } = req.query;

  try {
    let query = db.select().from(events);
    const conditions = [];

    if (societyId) {
      conditions.push(eq(events.societyId, parseInt(societyId)));
    }

    if (category) {
      conditions.push(ilike(events.category, category));
    }

    if (q) {
      conditions.push(ilike(events.title, `%${q}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // 🔥 FIX: Use events.startDate instead of events.date
    // Also ensures the column exists to avoid "order by desc" syntax errors
    const allEvents = await query.orderBy(desc(events.startDate || events.id));
    
    res.json(allEvents);
  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 2. Create an event (Protected - Admin Only)
// backend/routes/events.js
// 2. Create an event (Protected - Admin Only)
router.post('/', authenticateToken, (req, res, next) => {
  uploadBanner.single('banner')(req, res, (err) => {
    if (err) {
      // 🔴 This is where the "red write up" (error message) is generated
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "File too large. Max limit is 10MB." });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // 🔥 This catches your "Only image files..." error from fileFilter
        return res.status(400).json({ error: err.message });
      }
    }
    next();
  });
}, async (req, res) => {
  const { 
    title, 
    societyId, 
    // Remove category if it's no longer in your schema
    eventType, 
    shortDescription, 
    longDescription, 
    startDate, 
    endDate, 
    location, 
    registrationDeadline,
    capacity // Added capacity so it saves correctly
  } = req.body;

  const bannerPath = req.file ? `/uploads/banners/${req.file.filename}` : null;

  try {
    // Ownership Verification
    const [ownedSociety] = await db.select()
      .from(societies)
      .where(and(
        eq(societies.id, parseInt(societyId)),
        eq(societies.ownerId, req.user.id)
      ));

    if (!ownedSociety) {
      return res.status(403).json({ message: "Unauthorized: You don't lead this society." });
    }

    // 4. Save to Database - SYNCED WITH SCHEMA
    const [newEvent] = await db.insert(events).values({
      title,
      societyId: parseInt(societyId),
      banner: bannerPath,
      eventType, // ✅ Correct field
      shortDescription,
      longDescription,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      location,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      capacity: capacity ? parseInt(capacity) : 100, // ✅ Map capacity
      createdBy: req.user.id 
    }).returning();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("EVENT ERROR:", err);
    res.status(500).json({ error: "Could not publish event. Check your fields." });
  }
});

router.post('/:id/register', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    // 1. Get Event Details (specifically capacity)
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Check current registration count
    const [currentCount] = await db
      .select({ value: count() })
      .from(registrations)
      .where(eq(registrations.eventId, eventId));

    // 3. Compare with capacity
    if (event.capacity && currentCount.value >= event.capacity) {
      return res.status(400).json({ message: "Event is full! Keep an eye out for more." });
    }

    // 4. Check if already registered (prevent duplicates)
    const [existing] = await db
      .select()
      .from(registrations)
      .where(and(eq(registrations.userId, userId), eq(registrations.eventId, eventId)));

    if (existing) return res.status(400).json({ message: "Already registered!" });

    // 5. Finalize registration
    await db.insert(registrations).values({ userId, eventId });

    res.status(201).json({ message: "See you at the event!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});
router.get('/:id/attendees', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    // 1. First, find the event to check who created it
    const [event] = await db.select().from(events).where(eq(events.id, eventId));

    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Security check: Only the creator of the event can see the list
    // This allows any student who created a society/event to manage it
    if (event.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You are not the organizer of this event." });
    }

    // 3. Fetch the list
    const attendeeList = await db
      .select({
        studentName: users.name,
        studentEmail: users.email,
        registeredAt: registrations.registeredAt,
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
// 4. Get events registered by the current user
// backend/routes/events.js

// 4. Get events registered by the current user (Fixed)
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    const myEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate, // ✅ Use startDate
        location: events.location,
        banner: events.banner,
        eventType: events.eventType, // ✅ Change from category
        shortDescription: events.shortDescription
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.userId, req.user.id));
      
    res.json(myEvents);
  } catch (err) {
    console.error("Drizzle Select Error:", err);
    res.status(500).json({ error: "Could not fetch your schedule" });
  }
});

router.get('/my-schedule', authenticateToken, async (req, res) => {
  try {
    const myEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate, // ✅ Fix: events.date -> events.startDate
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

// 6. Delete an Event (Protected - Admin/Creator Only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    // 1. Fetch Event & Society to verify full admin rights
    const [eventData] = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId));

    if (!eventData) {
      return res.status(404).json({ message: "Event not found." });
    }

    // 2. Security Fix: Must be the Creator OR the Society Owner
    // Enforcing Number() prevents string vs integer comparison bugs
    const isCreator = Number(eventData.event.createdBy) === Number(req.user.id);
    const isOwner = Number(eventData.society.ownerId) === Number(req.user.id);

    if (!isCreator && !isOwner) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own events." });
    }

    // 3. Delete associated registrations first (to avoid Foreign Key errors)
    await db.delete(registrations).where(eq(registrations.eventId, eventId));

    // 4. Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    res.json({ message: "Event and all its registrations have been deleted." });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});
// Get all users who registered for ANY event I created
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
      .innerJoin(societies, eq(events.societyId, societies.id)) // Join to check ownership
      .innerJoin(users, eq(registrations.userId, users.id))
      .where(eq(societies.ownerId, req.user.id)); // Filter by Society Owner

    res.json(stats);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch organizer stats" });
  }
});
// backend/routes/events.js

// backend/routes/events.js

router.get('/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id); // More robust than parseInt
    
    if (isNaN(eventId)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }

    // Use .limit(1) to speed up the query once a match is found
    const data = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId))
    .limit(1);

    if (data.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Performance Error:", err);
    res.status(500).json({ error: "Database timeout" });
  }
});

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

  // 🛡️ Safe Date Parser: Handles empty strings and "null" from FormData
  const parseDate = (d) => (d && d !== "null" && d !== "") ? new Date(d) : null;

  try {
    // 1. Fetch Event & Society to verify Admin rights
    const [eventData] = await db.select({
      event: events,
      society: societies
    })
    .from(events)
    .innerJoin(societies, eq(events.societyId, societies.id))
    .where(eq(events.id, eventId));

    if (!eventData) {
      return res.status(404).json({ error: "Event not found." });
    }

    // 2. Security: Must be the Creator OR the Society Owner
    const isCreator = Number(eventData.event.createdBy) === Number(req.user.id);
    const isOwner = Number(eventData.society.ownerId) === Number(req.user.id);
    
    if (!isCreator && !isOwner) {
      return res.status(403).json({ error: "Unauthorized: You don't manage this event." });
    }

    // 3. Safely map string data back to proper SQL types
    const updateData = {
      title, 
      eventType, 
      location, 
      shortDescription,
      longDescription,
      capacity: parseInt(capacity) || 100, // Fallback to 100 if NaN
      startDate: new Date(startDate),      // Start date is required
      endDate: parseDate(endDate),
      registrationDeadline: parseDate(registrationDeadline)
    };
    
    // 4. Only update the banner if a new file was uploaded
    if (req.file) {
      updateData.banner = `/uploads/banners/${req.file.filename}`;
    }

    // 5. Perform the Drizzle Update
    const [updatedEvent] = await db.update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning();

    res.json(updatedEvent);
  } catch (err) {
    // 🔥 If it still crashes, this will print the exact reason to your backend terminal
    console.error("🔥 PUT /api/events/:id ERROR:", err);
    res.status(500).json({ error: "Database error. Check terminal for details." });
  }
});
export default router;