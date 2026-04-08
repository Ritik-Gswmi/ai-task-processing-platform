const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed. Retrying...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;