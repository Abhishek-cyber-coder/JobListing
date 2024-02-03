const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/auth");
// Connect Server
const app = express();

// Parse JSON
app.use(express.json());

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

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is started at the port ${PORT}`);
  }
});
