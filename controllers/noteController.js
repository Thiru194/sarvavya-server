const Note = require("../models/Note");

// Can this user create/edit/delete this note?
const canModify = (note, user) =>
  !!user && (user.role === "admin" || String(note.owner) === String(user._id));

// Fields a client is allowed to set/update
const pickFields = (body) => {
  const out = {};
  if (body.text !== undefined) out.text = body.text;
  if (body.color !== undefined) out.color = body.color;
  if (body.pinned !== undefined) out.pinned = !!body.pinned;
  if (body.shared !== undefined) out.shared = !!body.shared;
  if (body.x !== undefined) out.x = body.x;
  if (body.y !== undefined) out.y = body.y;
  if (body.tags !== undefined) {
    out.tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 10)
      : [];
  }
  return out;
};

// GET /api/notes  (optionalAuth)
// The board is admin-managed: everyone (guests, users, admins) sees all
// notes read-only. Only admins can create/edit/delete them.
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({
      pinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/notes  (protect)
const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...pickFields(req.body),
      owner: req.user._id,
      ownerName: req.user.name,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notes/:id  (protect) — owner or admin only
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canModify(note, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own notes" });
    }

    Object.assign(note, pickFields(req.body));
    // validateModifiedOnly so legacy notes (missing newer required fields)
    // can still be updated for the fields that actually changed
    await note.save({ validateModifiedOnly: true });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notes/:id  (protect) — owner or admin only
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!canModify(note, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own notes" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
