const express = require("express");

const {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Authenticated
router.get("/me", protect, getMe);

// Admin only — user management
router.get("/users", protect, adminOnly, getUsers);
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
