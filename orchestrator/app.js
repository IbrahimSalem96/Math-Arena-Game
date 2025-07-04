require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mainRoutes = require('./routes/main.routes');


const app = express();
app.use(express.json());
app.use('/', mainRoutes);

module.exports = app; 
