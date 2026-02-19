import express from 'express';
import { db } from '../db/index.js';
import { users,registrations } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq,sql } from 'drizzle-orm';

const router = express.Router();

// 1. Get Profile (Protected)
// backend/routes/users.js
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    // Explicitly select the email column
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email, // ⬅️ Ensure this is here!
        role: users.role,
        phone: users.phone
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate stats for the Profile/Dashboard
    const [stats] = await db.select({
      totalRegistrations: sql`count(${registrations.id})`,
      totalAttended: sql`count(case when ${registrations.attended} = true then 1 end)`
    })
    .from(registrations)
    .where(eq(registrations.userId, req.user.id));

    res.json({
      ...user,
      totalRegistrations: parseInt(stats.totalRegistrations) || 0,
      totalAttended: parseInt(stats.totalAttended) || 0,
      xp: (parseInt(stats.totalRegistrations) * 100),
      isOrganizer: user.role === 'admin'
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Update Profile (Protected)
router.patch('/profile', authenticateToken, async (req, res) => {
  const { name } = req.body;

  try {
    const updatedUser = await db.update(users)
      .set({ name })
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email
      });

    res.json({ message: "Profile updated!", user: updatedUser[0] });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
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