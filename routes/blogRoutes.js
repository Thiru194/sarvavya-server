const express = require("express");

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(requireAdmin, createBlog);

router.route("/:id")
  .get(getBlogById)
  .put(requireAdmin, updateBlog)
  .delete(requireAdmin, deleteBlog);

module.exports = router;