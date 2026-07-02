const Contact = require("../models/Contact");

// Create Contact enquiry (public)
const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      message: "Message submitted successfully",
      id: contact._id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get All Contact enquiries (admin only)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};
