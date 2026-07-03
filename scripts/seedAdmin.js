// One-time seed script to create (or update) the admin user.
//
// Reads ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD from the environment
// (.env) and upserts an admin account. Safe to re-run: if the admin already
// exists its password is reset to the current ADMIN_PASSWORD.
//
// Usage:  npm run seed:admin

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment."
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ERROR: ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email: email.toLowerCase().trim() });

  if (user) {
    user.name = name;
    user.password = password; // pre-save hook re-hashes
    user.role = "admin";
    await user.save();
    console.log(`Updated existing admin: ${user.email}`);
  } else {
    user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });
    console.log(`Created admin: ${user.email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (err) => {
  console.error(err.message);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
