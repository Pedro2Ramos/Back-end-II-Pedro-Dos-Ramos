require('dotenv').config();
const express = require('express');
const passport = require('./config/passport');
const sessionsRouter = require("./routes/sessions");

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/api/sessions", sessionsRouter);

module.exports = app;
