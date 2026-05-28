const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    image: { type: String, required: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: { type: Date, default: Date.now() },
      },
    ],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
