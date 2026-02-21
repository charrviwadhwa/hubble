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
const upload = multer({ storage ,
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


// 1. Create a Society
// backend/routes/societies.js

// 1. Create a Society (Updated with strict error handling)
router.post('/create', authenticateToken, (req, res, next) => {
  // 🔥 Wrap upload in a function to catch the fileFilter error
  upload.single('logo')(req, res, (err) => {
    if (err) {
      // Catch Multer limit errors (like file size)
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      // Catch our custom "Only image files..." error
      return res.status(400).json({ error: err.message });
    }
    next(); // No error? Move to the database insertion
  });
}, async (req, res) => {
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

  const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;

  try {
    const [newSociety] = await db.insert(societies).values({
      name,
      category, 
      description,
      collegeName, 
      presidentName, 
      instaLink: insta,
      mailLink: mail,
      linkedinLink: linkedin,
      logo: logoPath,
      ownerId: req.user.id 
    }).returning();

    res.json(newSociety);
  } catch (err) {
    console.error("Drizzle Insertion Error:", err);
    res.status(500).json({ error: "Database error: Could not create society." });
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