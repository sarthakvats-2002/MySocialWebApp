const router = require("express").Router();
const Story = require("../models/Story");
const { verifyToken } = require("../middleware/auth");

// Create story
router.post("/", verifyToken, async (req, res) => {
  try {
    const newStory = new Story(req.body);
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (err) {
    res.status(500).json({ message: "Error creating story", error: err });
  }
});

// Get stories from user's followings
router.get("/timeline/:userId", verifyToken, async (req, res) => {
  try {
    const User = require("../models/User");
    const currentUser = await User.findById(req.params.userId);
    
    const userIds = [...currentUser.followings, req.params.userId];
    
    const stories = await Story.find({
      userId: { $in: userIds },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stories", error: err });
  }
});

// Get user's stories
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({
      userId: req.params.userId,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user stories", error: err });
  }
});

// Add view to story
router.put("/:id/view", verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story.views.includes(req.body.userId)) {
      await story.updateOne({ $push: { views: req.body.userId } });
      res.status(200).json({ message: "View recorded" });
    } else {
      res.status(200).json({ message: "Already viewed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error recording view", error: err });
  }
});

// Delete story
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (story.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete your own stories" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting story", error: err });
  }
});

module.exports = router;

