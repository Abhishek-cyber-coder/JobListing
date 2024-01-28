const express = require("express");
require("dotenv").config();
// Connect Server
const app = express();

// connect DB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB is connected successfully!");
  })
  .catch((err) => {
    console.log("Some error occured while connecting DB", err);
  });

// Health API
app.get("/health", (req, res) => {
  res.json({
    service: "Job listing server",
    status: "active",
    time: new Date(),
  });
});

const PORT = 3000;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is started at the port ${PORT}`);
  }
});
