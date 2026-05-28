const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    text: {
      type: String,
    },

    type: {
      type: String,
      enum: ["like", "comment", "follow", "dislike", "message"],
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
