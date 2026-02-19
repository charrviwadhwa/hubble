import express from 'express';
import { db } from '../db/index.js'; // Ensure the path and extension are correct
import { societies,events,registrations,users } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq,sql } from 'drizzle-orm';

const router = express.Router();

// 1. Create a Society
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const newSociety = await db.insert(societies).values({
      name,
      description,
      logo,
      ownerId: req.user.id // Link society to the person who created it
    }).returning();
    
    res.status(201).json(newSociety[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating society" });
  }
});

// 2. Get My Societies
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const mySocieties = await db.select()
      .from(societies)
      .where(eq(societies.ownerId, req.user.id));
    res.json(mySocieties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your societies" });
  }
});

router.get('/:id/stats', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);

  try {
    // 1. Get Society Totals
    const [stats] = await db.select({
      totalRegistrations: sql`count(${registrations.id})`,
      // Logic for 'attended' can be a boolean column in your registrations table
      totalAttended: sql`count(case when ${registrations.attended} = true then 1 end)`
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(events.societyId, societyId));

    // 2. Get User Milestones for Badges
    const [userProgress] = await db.select({
      regCount: sql`count(${registrations.id})`
    })
    .from(registrations)
    .where(eq(registrations.userId, req.user.id));

    res.json({
      stats,
      badges: {
        pioneer: userProgress.regCount >= 1,
        regular: userProgress.regCount >= 5,
        organizer: req.user.role === 'admin'
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hub stats" });
  }
});

export default router; // Use export default instead of module.exports