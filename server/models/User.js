const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  userType: { type: String, enum: ["student", "society-admin"], default: "student" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
