const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  coverImageUrl: String,
  society: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },
  category: String,
  capacity: Number,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Event", Schema);
