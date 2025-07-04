require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const startConsumer = require('./rabbitmq/consumer');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB (Players)");
    startConsumer();
  })
  .catch((err) => console.error("DB connection error:", err));
