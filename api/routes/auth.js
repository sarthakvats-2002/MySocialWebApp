const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegistration, validateLogin } = require("../middleware/validation");

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

//REGISTER
router.post("/register", validateRegistration, async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: req.body.email }, { username: req.body.username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email or username already exists" 
      });
    }

    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new User (only with essential fields from request)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save User
    const user = await newUser.save();

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const { password, ...userData } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

//LOGIN
router.post("/login", validateLogin, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = generateToken(user);

    // Update user online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Return user without password
    const { password, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
});

module.exports = router;