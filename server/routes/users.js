import express from 'express';
import { db } from '../db/index.js';
import { users,registrations } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq,sql } from 'drizzle-orm';

const router = express.Router();

// 1. Get Profile (Protected)
// 1. Get Profile (Protected)
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    // 🔍 Only select columns that exist in your current schema.js
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email, 
        role: users.role,
        branch: users.branch,
        year: users.year,
        github: users.github,
        linkedin: users.linkedin
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate stats safely
    const myRegistrations = await db.select()
      .from(registrations)
      .where(eq(registrations.userId, req.user.id));

    res.json({
      ...user,
      totalRegistrations: myRegistrations.length,
      totalAttended: myRegistrations.filter(reg => reg.attended).length,
      isOrganizer: user.role === 'admin' || user.role === 'founder'
    });
  } catch (err) {
    console.error("CRITICAL PROFILE ERROR:", err);
    // 🟢 This sends the real error (e.g., "column leetcode does not exist") to the network tab
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 2. Update Profile (Protected)
// UPDATE USER PROFILE
// 2. Update Profile
router.patch('/me/profile', authenticateToken, async (req, res) => {
  const { branch, year, github, linkedin } = req.body; // 🟢 REMOVED: leetcode

  try {
    const [updatedUser] = await db.update(users)
      .set({ 
        branch, 
        year, 
        github, 
        linkedin 
      })
      .where(eq(users.id, req.user.id))
      .returning();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

router.put('/me/update', authenticateToken, async (req, res) => {
  const { name, phone } = req.body; // Do NOT destructure email here

  try {
    const [updatedUser] = await db.update(users)
      .set({ 
        name: name,
        phone: phone 
      })
      .where(eq(users.id, req.user.id))
      .returning();

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;