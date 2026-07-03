const express = require("express");

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route("/:id")
  .get(getBlogById)
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

module.exports = router;