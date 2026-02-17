import express from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// 1. Get Profile (Protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    })
    .from(users)
    .where(eq(users.id, req.user.id));

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch profile" });
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