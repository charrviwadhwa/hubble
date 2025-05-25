const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (make sure MongoDB is running locally)
mongoose.connect("mongodb://localhost:27017/hubbleDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define a User schema and model
const userSchema = new mongoose.Schema({
  email: String,
  uid: String,
});

const User = mongoose.model("User", userSchema);

// Route to add user
app.post("/api/users/add", async (req, res) => {
  const { email, uid } = req.body;

  try {
    const newUser = new User({ email, uid });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
