import express from 'express';
import { db } from '../db/index.js'; 
import { societies, events, registrations, users, societyManagers } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, sql, and, count, inArray } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: './uploads/logos/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); 
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed!"));
    }
  }
});


// ==========================================
// 1. CREATE SOCIETY
// ==========================================
router.post('/create', authenticateToken, (req, res, next) => {
  upload.single('logo')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next(); 
  });
}, async (req, res) => {
  const { name, category, description, collegeName, presidentName, insta, mail, linkedin } = req.body;
  const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : null;

  try {
    // A. Create the society
    const [newSociety] = await db.insert(societies).values({
      name, category, description, collegeName, presidentName, 
      instaLink: insta, mailLink: mail, linkedinLink: linkedin,
      logo: logoPath, ownerId: req.user.id 
    }).returning();

    // B. Cofounder Fix: Immediately add the creator to the society_managers table
    await db.insert(societyManagers).values({
      userId: req.user.id,
      societyId: newSociety.id
    });

    res.json(newSociety);
  } catch (err) {
    console.error("Drizzle Insertion Error:", err);
    res.status(500).json({ error: "Database error: Could not create society." });
  }
});


// ==========================================
// 2. GET MY SOCIETIES (Cofounder Fix Applied)
// ==========================================
router.get('/my', authenticateToken, async (req, res) => {
  try {
    // Instead of checking ownerId, we check the societyManagers table
    // so it fetches societies you founded AND ones you co-manage
    const mySocieties = await db.select({
      id: societies.id,
      name: societies.name,
      category: societies.category,
      logo: societies.logo,
      ownerId: societies.ownerId // Needed for UI "Founder" badge
    })
    .from(societies)
    .innerJoin(societyManagers, eq(societies.id, societyManagers.societyId))
    .where(eq(societyManagers.userId, req.user.id));
    
    res.json(mySocieties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your societies" });
  }
});


// ==========================================
// 3. GET SOCIETY STATS (Cofounder Fix Applied)
// ==========================================
router.get('/:id/stats', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);

  try {
    // Security: Check if user is a manager
    const [isManager] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, req.user.id)));
      
    if (!isManager) return res.status(403).json({ error: "Unauthorized access to stats." });

    const [stats] = await db.select({
      totalRegistrations: sql`count(${registrations.id})`,
      totalAttended: sql`count(case when ${registrations.attended} = true then 1 end)`
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(events.societyId, societyId));

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
        organizer: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hub stats" });
  }
});


// ==========================================
// 4. UPDATE SOCIETY (Cofounder Fix Applied)
// ==========================================
router.put('/:id', authenticateToken, (req, res, next) => {
  upload.single('logo')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const societyId = parseInt(req.params.id);
  const { name, category, description, collegeName, presidentName, insta, mail, linkedin } = req.body;

  try {
    // Security: Check if user is a manager (founder or cofounder)
    const [isManager] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, req.user.id)));

    if (!isManager) {
      return res.status(403).json({ error: "Unauthorized: You can only edit societies you manage." });
    }

    const updateData = {
      name, category, description, collegeName, presidentName,
      instaLink: insta, mailLink: mail, linkedinLink: linkedin,
    };

    if (req.file) updateData.logo = `/uploads/logos/${req.file.filename}`;

    const [updatedSociety] = await db.update(societies)
      .set(updateData)
      .where(eq(societies.id, societyId))
      .returning();

    res.json(updatedSociety);
  } catch (err) {
    res.status(500).json({ error: "Database error: Could not update society." });
  }
});


// ==========================================
// 5. DELETE SOCIETY (Cofounder Fix Applied)
// ==========================================
router.delete('/:id', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);

  try {
    // Security: Check if user is a manager (founder or cofounder)
    const [isManager] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, req.user.id)));

    if (!isManager) {
      return res.status(403).json({ error: "Unauthorized: You can only delete societies you manage." });
    }

    // Delete relationships to avoid foreign key errors (If not using cascade)
    await db.delete(societyManagers).where(eq(societyManagers.societyId, societyId));
    await db.delete(societies).where(eq(societies.id, societyId));

    res.json({ message: "Society successfully deleted." });
  } catch (err) {
    res.status(500).json({ error: "Could not delete society. Please check active events." });
  }
});


// ==========================================
// 6. TEAM MANAGEMENT: GET MANAGERS
// ==========================================
router.get('/:id/managers', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);
  try {
    const managers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isOwner: eq(societies.ownerId, users.id) // Identify the main founder
    })
    .from(societyManagers)
    .innerJoin(users, eq(societyManagers.userId, users.id))
    .leftJoin(societies, eq(societyManagers.societyId, societies.id))
    .where(eq(societyManagers.societyId, societyId));

    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team." });
  }
});


// ==========================================
// 7. TEAM MANAGEMENT: ADD CO-FOUNDER
// ==========================================
router.post('/:id/managers', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);
  const { email } = req.body;

  try {
    const [isManager] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, req.user.id)));
    if (!isManager) return res.status(403).json({ error: "Unauthorized" });

    const [newManager] = await db.select().from(users).where(eq(users.email, email));
    if (!newManager) return res.status(404).json({ error: "No student found with that email on Hubble." });

    const [existing] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, newManager.id)));
    if (existing) return res.status(400).json({ error: "This person is already a co-founder." });

    await db.insert(societyManagers).values({ userId: newManager.id, societyId });
    res.status(201).json({ message: "Co-founder added!", user: newManager });
  } catch (err) {
    res.status(500).json({ error: "Failed to add team member." });
  }
});


// ==========================================
// 8. TEAM MANAGEMENT: REMOVE CO-FOUNDER
// ==========================================
router.delete('/:id/managers/:userId', authenticateToken, async (req, res) => {
  const societyId = parseInt(req.params.id);
  const targetUserId = parseInt(req.params.userId);

  try {
    const [isManager] = await db.select().from(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, req.user.id)));
    if (!isManager) return res.status(403).json({ error: "Unauthorized" });

    const [society] = await db.select().from(societies).where(eq(societies.id, societyId));
    if (society.ownerId === targetUserId) {
      return res.status(400).json({ error: "You cannot remove the main founder." });
    }

    await db.delete(societyManagers)
      .where(and(eq(societyManagers.societyId, societyId), eq(societyManagers.userId, targetUserId)));
      
    res.json({ message: "Co-founder removed." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove team member." });
  }
});

export default router;