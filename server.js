const express = require("express");
const app = express();

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
