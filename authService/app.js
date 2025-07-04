require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const connectToDb = require('./config/connectToDb');
const authRoutes = require('./routes/auth.routes');

//connection to  Database
connectToDb()

// Init App
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

//start the server
module.exports = app; 

