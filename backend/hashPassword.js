const bcrypt = require("bcrypt");

async function generateHash() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  console.log("Hashed password:", hashedPassword);
}

generateHash();