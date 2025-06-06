const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes'); 
const societyRoutes = require('./routes/societyRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes); 
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);

mongoose.connect("mongodb://localhost:27017/hubbleDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// const userSchema = new mongoose.Schema({
//   email: String,
//   uid: String,
// });

// const User = mongoose.model("User", userSchema);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
