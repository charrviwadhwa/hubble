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
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email, 
        role: users.role,
        phone: users.phone,
        // 🟢 ADDED THE MISSING COLUMNS HERE
        branch: users.branch,
        year: users.year,
        github: users.github,
        linkedin: users.linkedin,
        leetcode: users.leetcode
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) return res.status(404).json({ error: "User not found" });

    // 🟢 SAFER STATS CALCULATION
    // Just fetch their registrations and count them in Javascript!
    const myRegistrations = await db.select({
      id: registrations.id,
      attended: registrations.attended
    })
    .from(registrations)
    .where(eq(registrations.userId, req.user.id));

    const totalReg = myRegistrations.length;
    const totalAtt = myRegistrations.filter(reg => reg.attended === true).length;

    res.json({
      ...user,
      totalRegistrations: totalReg,
      totalAttended: totalAtt,
      xp: (totalReg * 100),
      isOrganizer: user.role === 'admin'
    });
  } catch (err) {
    // 🔥 This will print the EXACT error in your Render terminal if it fails again
    console.error("Profile Fetch Error Details:", err); 
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 2. Update Profile (Protected)
// UPDATE USER PROFILE
router.patch('/me/profile', authenticateToken, async (req, res) => {
  const { branch, year, github, linkedin, leetcode } = req.body;

  try {
    const [updatedUser] = await db.update(users)
      .set({ 
        branch, 
        year, 
        github, 
        linkedin, 
        leetcode 
      })
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        name: users.name,
        branch: users.branch,
        year: users.year,
        github: users.github,
        linkedin: users.linkedin,
        leetcode: users.leetcode
      });

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile Update Error:", err);
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