const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username,
      isAdmin: user.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   GET /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/login",
    session: false 
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user);

      // Return user without password
      const { password, ...userData } = req.user._doc;

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
    } catch (err) {
      console.error("Google callback error:", err);
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendURL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;

