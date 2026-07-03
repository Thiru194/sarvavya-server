const express = require("express");

const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(optionalAuth, getNotes) // anyone can view the board
  .post(protect, adminOnly, createNote); // only admins can create

router
  .route("/:id")
  .put(protect, adminOnly, updateNote) // only admins can edit
  .delete(protect, adminOnly, deleteNote); // only admins can delete

module.exports = router;
