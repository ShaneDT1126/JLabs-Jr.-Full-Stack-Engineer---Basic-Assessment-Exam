const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = express.Router();

//LOGIN ENDPOINT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email or password required",
      });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//SAVE SEARCH HISTORY ENDPOINT
router.post("/history", authenticateToken, async (req, res) => {
  try {
    const { ip_address, geodata } = req.body;
    const userId = req.user.userId;

    if (!ip_address) {
      return res.status(400).json({
        error: "IP address is required",
      });
    }

    const [result] = await pool.query(
      `
        INSERT INTO search_history (user_id, ip_address, geo_data) VALUES (?, ?, ?)
        `,
      [userId, ip_address, JSON.stringify(geodata)]
    );

    res.json({
      message: "History saved!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("GET HISTORY ERROR", err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//GET SEARCH HISTORY
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [history] = await pool.query(
      `
        SELECT * FROM search_history WHERE user_id = ? ORDER BY created_at DESC
        `,
      [userId]
    );

    const parsedHistory = history.map((item) => ({
      ...item,
      geo_data:
        typeof item.geo_data === "string"
          ? JSON.parse(item.geo_data)
          : item.geo_data,
    }));

    res.json(parsedHistory);
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
