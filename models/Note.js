const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
      trim: true,
    },

    // Index into the client's sticky-note colour palette
    color: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Pin important notes (highlighted, brought to front)
    pinned: {
      type: Boolean,
      default: false,
    },

    // Shared notes are visible (read-only) to the whole team / public
    shared: {
      type: Boolean,
      default: false,
    },

    // Categories / tags
    tags: {
      type: [String],
      default: [],
    },

    // Free position on the board (for drag & drop)
    x: {
      type: Number,
      default: 30,
    },
    y: {
      type: Number,
      default: 30,
    },

    // Owner of the note
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Denormalized owner name for display
    ownerName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
