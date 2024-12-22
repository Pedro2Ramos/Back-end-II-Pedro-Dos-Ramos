// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const passport = require('passport');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
