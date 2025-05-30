const express = require('express');
const router = express.Router();
const Society = require('../models/Society');
const User = require('../models/User');


router.post('/', async (req, res) => {
  try {
    const { name, description, logoUrl, adminId, members  } = req.body;

    
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.userType !== "society-admin") {
      return res.status(400).json({ message: "Invalid admin user" });
    }

    const newSociety = new Society({ name, description, logoUrl, admin: adminId, members  });
    await newSociety.save();
    res.status(201).json(newSociety);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const societies = await Society.find()
      .populate('admin', 'email userType')
      .populate('members', 'email userType');
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id/members', async (req, res) => {
  try {
    const { id } = req.params; 
    const { memberId } = req.body;

    const user = await User.findById(memberId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const society = await Society.findById(id);
    if (!society) return res.status(404).json({ message: "Society not found" });

   
    if (!society.members.includes(memberId)) {
      society.members.push(memberId);
      await society.save();
    }

    res.json(society);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
