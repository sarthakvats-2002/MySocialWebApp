const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 100,
    },
    views: {
      type: Array,
      default: [],
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);

