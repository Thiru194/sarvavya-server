// Authentication middleware.
//
// `protect` verifies a JWT (sent as "Authorization: Bearer <token>") and
// attaches the authenticated user to req.user.
// `adminOnly` additionally requires that user to have the admin role.
//
// `requireAdmin` is the legacy static-token guard kept for backward
// compatibility; prefer `protect` + `adminOnly` for new routes.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server auth is not configured (JWT_SECRET missing)",
      });
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

// Populates req.user when a valid token is present, but never blocks the
// request. Use for endpoints that behave differently for guests vs users.
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (token && process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch {
    // Invalid/expired token — treat as guest
  }
  next();
};

// --- Legacy static-token guard (kept for backward compatibility) ---
const requireAdmin = (req, res, next) => {
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return res.status(500).json({
      message: "Server auth is not configured (ADMIN_TOKEN missing)",
    });
  }

  const headerToken = req.headers["x-admin-token"];
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const provided = headerToken || bearerToken;

  if (!provided || provided !== expected) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = { protect, adminOnly, optionalAuth, requireAdmin };
