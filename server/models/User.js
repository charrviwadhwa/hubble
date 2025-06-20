const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  userType: { type: String, enum: ["student", "society"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
