const Note = require("../models/Note");

// Get All Notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: 1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Note
const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      text: req.body.text || "",
      color: req.body.color || 0,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        color: req.body.color,
      },
      {
        returnDocument: "after",
        runValidators: true,
        omitUndefined: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(
      req.params.id
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
