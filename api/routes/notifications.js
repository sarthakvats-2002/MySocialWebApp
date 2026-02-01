const router = require("express").Router();
const Notification = require("../models/Notification");
const { verifyToken } = require("../middleware/auth");

// Create notification
router.post("/", verifyToken, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ message: "Error creating notification", error: err });
  }
});

// Get user's notifications
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err });
  }
});

// Mark notification as read
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking notification as read", error: err });
  }
});

// Mark all notifications as read
router.put("/read-all/:userId", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking all notifications as read", error: err });
  }
});

// Delete notification
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification", error: err });
  }
});

module.exports = router;

