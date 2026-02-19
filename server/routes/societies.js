import express from 'express';
import { db } from '../db/index.js'; // Ensure the path and extension are correct
import { societies,events,registrations,users } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq,sql } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/logos/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 1. Create a Society
// backend/routes/societies.js

router.post('/create', authenticateToken, upload.single('logo'), async (req, res) => {
  // 1. Destructure ALL fields sent from the frontend
  const { 
    name, 
    category, 
    description, 
    collegeName, 
    presidentName, 
    insta, 
    mail, 
    linkedin 
  } = req.body;

  // 2. Map the logo path
  const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;

  try {
    // 3. Insert into database using the correct schema keys
    const [newSociety] = await db.insert(societies).values({
      name,
      category, // Ensure this exists in your schema.js!
      description,
      collegeName, // Ensure this exists in your schema.js!
      presidentName, // Ensure this exists in your schema.js!
      instaLink: insta,
      mailLink: mail,
      linkedinLink: linkedin,
      logo: logoPath,
      ownerId: req.user.id 
    }).returning();

    res.json(newSociety);
  } catch (err) {
    console.error("Drizzle Insertion Error:", err); // This will show the exact missing column in your terminal
    res.status(500).json({ error: "Failed to create society - check if all columns exist in schema" });
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