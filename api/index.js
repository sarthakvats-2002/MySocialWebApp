const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const session = require("express-session");

// Import routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const commentRoute = require("./routes/comments");
const notificationRoute = require("./routes/notifications");
const storyRoute = require("./routes/stories");

const PORT = process.env.PORT || 8800;

dotenv.config();

// CORS configuration
const corsOptions = {
    origin: [
        'https://echoconnect-social.netlify.app',  // Your Netlify URL (no trailing slash!)
        'http://localhost:3000'  // For local testing
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan("common"));
app.use(cors(corsOptions));
app.use("/api/", limiter);

// Passport & Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require("./config/passport")(passport);

// Serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));

// File upload configuration with security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/auth", googleAuthRoute); // Google OAuth routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comments", commentRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/stories", storyRoute);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: [
      'https://echoconnect-social.netlify.app',
      'https://echoconnect.netlify.app',
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users
let activeUsers = [];

io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);

  // Add new user
  socket.on("addUser", (userId) => {
    const userExists = activeUsers.find((user) => user.userId === userId);
    if (!userExists) {
      activeUsers.push({ userId, socketId: socket.id });
      console.log("✅ User added:", userId);
    }
    io.emit("getUsers", activeUsers);
  });

  // Send message
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        conversationId,
        createdAt: new Date(),
      });
    }
  });

  // Send notification
  socket.on("sendNotification", ({ receiverId, notification }) => {
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("getNotification", notification);
    }
  });

  // Typing indicator
  socket.on("typing", ({ senderId, receiverId }) => {
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("userStopTyping", { senderId });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("👤 User disconnected:", socket.id);
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", activeUsers);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
