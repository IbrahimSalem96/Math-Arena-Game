const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectToDb;
