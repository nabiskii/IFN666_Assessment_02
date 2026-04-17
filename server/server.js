require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
const indexRouter = require("./src/routes/index");

const app = express();

// Morgan logging to file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

// MongoDB connection
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/pawmatch";

async function main() {
  await mongoose.connect(mongoDB);
}

main().catch((err) => console.log(err));

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  exposedHeaders: ["Authorization", "Link"],
  origin: '*'
}));

// Request logging
app.use((req, res, next) => {
  console.log(`Received request for route: ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api", indexRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
