import express from 'express';
import { db } from './db/index.js';
import { events } from './db/schema.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Get all events for Hubble's main feed
app.get('/api/events', async (req, res) => {
  try {
    const allEvents = await db.select().from(events);
    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Hubble Backend orbiting on port ${PORT}`));