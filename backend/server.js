const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initDatabase } = require("./config/database.js");
const apiRoutes = require("./routes/api.js");

const app = express();
const PORT = process.env.PORT || 8000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/api", apiRoutes);

// HEALTHCHECK ENDPOINT
app.get("/", (req, res) => {
  res.json({
    message: "JLabs Exam API Running",
  });
});

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 API endpoints:`);
      console.log(`   POST http://localhost:${PORT}/api/login`);
      console.log(`   GET  http://localhost:${PORT}/api/history`);
      console.log(`   POST http://localhost:${PORT}/api/history`);
      console.log(`   DELETE http://localhost:${PORT}/api/history`);
    });
  } catch (err) {
    console.err("Failed to start server", err);
    process.exit(1);
  }
}


startServer();