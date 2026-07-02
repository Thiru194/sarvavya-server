require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

connectDB();

// Restrict CORS to the configured client origin(s). CLIENT_URL may be a
// comma-separated list; if unset, fall back to allowing all origins (dev).
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : null;

app.use(
  cors({
    origin: allowedOrigins || true,
  })
);

app.use(express.json());

app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
