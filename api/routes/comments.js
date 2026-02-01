const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");
const { validateComment } = require("../middleware/validation");

// Create comment
router.post("/", verifyToken, validateComment, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();

    // Increment comment count on post
    await Post.findByIdAndUpdate(req.body.postId, {
      $inc: { comments: 1 },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: "Error creating comment", error: err });
  }
});

// Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err });
  }
});

// Delete comment
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Decrement comment count on post
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { comments: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err });
  }
});

// Like/unlike comment
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "Comment liked" });
    } else {
      await comment.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "Comment unliked" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error liking comment", error: err });
  }
});

module.exports = router;

