const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { verifyToken } = require("../middleware/auth");

// Add new message
router.post("/", verifyToken, async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();

    // Update conversation last message
    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      lastMessage: req.body.text,
      lastMessageTime: new Date(),
    });

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
});

// Get messages in a conversation
router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
});

// Mark messages as read
router.put("/:conversationId/read", verifyToken, async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: { $ne: req.body.userId },
        read: false,
      },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking messages as read", error: err });
  }
});

module.exports = router;

