import express from 'express';
import { db } from '../db/index.js'; // Ensure the path and extension are correct
import { societies } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

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

export default router; // Use export default instead of module.exports