import express from 'express';
import { db } from '../db/index.js';
import { users,registrations } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq,sql } from 'drizzle-orm';

const router = express.Router();

// 1. Get Profile (Protected)
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    // 1. Fetch user basic info
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    
    // 2. Count total registrations and attendance
    const [stats] = await db.select({
      totalRegistrations: sql`count(${registrations.id})`,
      totalAttended: sql`count(case when ${registrations.attended} = true then 1 end)`
    })
    .from(registrations)
    .where(eq(registrations.userId, req.user.id));

    // 3. Return combined data for the frontend
    res.json({
      name: user.name,
      role: user.role,
      isOrganizer: user.role === 'admin',
      totalRegistrations: parseInt(stats.totalRegistrations) || 0,
      totalAttended: parseInt(stats.totalAttended) || 0,
      xp: (parseInt(stats.totalRegistrations) * 100) + (parseInt(stats.totalAttended) * 200),
      badges: [] // Logic for unlocking specific badge IDs can go here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load profile data" });
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

export default router;