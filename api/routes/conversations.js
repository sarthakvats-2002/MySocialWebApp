const router = require("express").Router();
const Conversation = require("../models/Conversation");
const { verifyToken } = require("../middleware/auth");

// Create new conversation
router.post("/", verifyToken, async (req, res) => {
  try {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(500).json({ message: "Error creating conversation", error: err });
  }
});

// Get conversations of a user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ lastMessageTime: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations", error: err });
  }
});

// Get conversation between two users
router.get("/find/:firstUserId/:secondUserId", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Error finding conversation", error: err });
  }
});

module.exports = router;

