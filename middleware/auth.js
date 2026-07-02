// Simple admin-token guard for blog write operations.
// The client must send the token in the "x-admin-token" header (or as a
// "Bearer <token>" Authorization header). The expected value comes from
// the ADMIN_TOKEN environment variable.

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
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};

module.exports = { requireAdmin };
