
const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// Save user route
router.post("/saveuser", async (req, res) => {
  console.log("POST /saveuser hit");
  console.log("Received body:", req.body);

  const { uid, email, userType } = req.body;
 

  try {
    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({ uid, email, userType });
    await newUser.save();

    res.status(201).json({ message: "User saved successfully" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
