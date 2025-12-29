const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");
require("dotenv").config();

async function seedUsers() {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?",
      ["test@jlabs.com", hashedPassword, hashedPassword]
    );

    console.log("✅ User seeded successfully!");
    console.log("📧 Email: test@jlabs.com");
    console.log("🔑 Password: password123");
    console.log("");
    console.log("Use these credentials to login from the frontend!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
