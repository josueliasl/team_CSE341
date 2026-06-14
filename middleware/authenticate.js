const isAuthenticated = (req, res, next) => {
  console.log("🔒 Authentication check");
  console.log("  - isAuthenticated:", req.isAuthenticated?.());
  console.log("  - Session ID:", req.sessionID);
  console.log("  - User:", req.user?.id || 'none');
  
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log("✅ User is authenticated, proceeding...");
    return next();
  }

  console.log("❌ User is NOT authenticated");
  res.status(401).json({
    message: "Unauthorized - Please authenticate via /auth/github",
    authUrl: "http://localhost:3002/auth/github",
    sessionId: req.sessionID
  });
};

module.exports = isAuthenticated;