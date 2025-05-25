const express = require("express");
const router = express.Router();
const User = require("../models/User");
const firebaseAuth = require("../middleware/FirebaseAuth");

router.post("/", firebaseAuth, async (req, res) => {
  const { email, role } = req.body;
  const uid = req.user.uid;

  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, role });
    }
    res.status(200).json({ message: "User stored in DB" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
