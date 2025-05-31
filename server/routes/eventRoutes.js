const express = require('express');
const router = express.Router();
const Event = require('../models/Events');

router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.society) filters.society = req.query.society;

    const events = await Event.find(filters).populate('society', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('society registeredUsers');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/:id/register', async (req, res) => {
  try {
    const { userId } = req.body; // Assume this comes from frontend
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.registeredUsers.includes(userId)) return res.status(400).json({ error: 'Already registered' });

    event.registeredUsers.push(userId);
    await event.save();

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
