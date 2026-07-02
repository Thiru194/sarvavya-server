const express = require("express");

const {
  createContact,
  getContacts,
} = require("../controllers/contactController");

const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .post(createContact)
  .get(requireAdmin, getContacts);

module.exports = router;
