import express from 'express';
import { db } from '../db/index.js';
import { events } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { desc, eq, and, count } from 'drizzle-orm';
import { registrations, users } from '../db/schema.js';
const router = express.Router();

// 1. Get all events (Public - for the Feed)
import { ilike } from 'drizzle-orm'; // Import ilike

router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let query = db.select().from(events);

    if (category) {
      // Use ilike for case-insensitive matching
      query = query.where(ilike(events.category, category));
    }

    const allEvents = await query.orderBy(desc(events.date));
    res.json(allEvents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 2. Create an event (Protected - Admin Only)
router.post('/', authenticateToken, async (req, res) => {
  // Make sure 'category' is included here!
  const { title, description, date, location, capacity, category } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only societies can create events" });
  }

  try {
    const newEvent = await db.insert(events).values({
      title,
      description,
      date: new Date(date),
      location,
      capacity: capacity ? parseInt(capacity) : 100,
      // If category is provided in Postman, use it; otherwise, use "General"
      category: category || "General", 
      createdBy: req.user.id 
    }).returning();

    res.status(201).json(newEvent[0]);
  } catch (err) {
    console.error("FULL DATABASE ERROR:", err); 
    res.status(400).json({ error: "Could not create event", details: err.message });
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

  // Security check: You could add a check here to ensure 
  // only the creator of the event can see the attendee list.
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    // We join the 'registrations' table with the 'users' table 
    // to get the actual names and emails of the people who signed up.
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
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    const myEvents = await db
      .select({
        eventId: events.id,
        title: events.title,
        date: events.date,
        location: events.location,
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.userId, req.user.id));

    res.json(myEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your schedule" });
  }
});
router.get('/my-schedule', authenticateToken, async (req, res) => {
  try {
    // We join the 'registrations' table with 'events' 
    // to get the details of all events this user joined.
    const myEvents = await db
      .select({
        id: events.id,
        title: events.title,
        date: events.date,
        location: events.location
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(registrations.userId, req.user.id));

    res.json(myEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your schedule" });
  }
});

// 6. Delete an Event (Protected - Admin/Creator Only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    // 1. Find the event first to check ownership
    const [event] = await db.select().from(events).where(eq(events.id, eventId));

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // 2. Security: Only the creator (or a super-admin) can delete it
    if (event.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own events." });
    }

    // 3. Delete associated registrations first (to avoid Foreign Key errors)
    await db.delete(registrations).where(eq(registrations.eventId, eventId));

    // 4. Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    res.json({ message: "Event and all its registrations have been deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});
export default router;