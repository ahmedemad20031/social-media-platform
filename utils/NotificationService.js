const { getIO } = require("./socket");

const getReceiverSocketId = (receiverId) => {
  return receiverId ? receiverId.toString() : null;
};

function sendLikeNotification(req, post) {
  const io = getIO();
  if (!io) return;

  const receiverId = post?.user?._id
    ? post.user._id.toString()
    : post?.user?.toString();

  if (receiverId === req.user.id.toString()) return;

  console.log(`📡 Sending live notification straight to room: ${receiverId}`);

  io.to(receiverId).emit("getNotification", {
    type: "like",
    sender: req.user.id,
    postId: post._id,
    createdAt: new Date(),
  });
}

function sendCommentNotification(req, post, comment) {
  const io = getIO();
  if (!io) return;

  const receiverId = post?.user?._id
    ? post.user._id.toString()
    : post?.user?.toString();

  if (receiverId === req.user.id.toString()) return;

  io.to(receiverId).emit("getNotification", {
    type: "comment",
    sender: req.user.id,
    postId: post._id,
    commentId: comment?._id,
    createdAt: new Date(),
  });
}

function followNotification(req, user) {
  const io = getIO();
  if (!io) return;

  const receiverId = user?._id?.toString();

  if (!receiverId) return;

  io.to(receiverId).emit("getNotification", {
    type: "follow",
    sender: req.user.id,
    createdAt: new Date(),
  });
}

function sendMessageNotification(req, chat, message) {
  const io = getIO();
  if (!io) return;

  const receiverId = chat.members.find(
    (member) => member.toString() !== req.user.id.toString(),
  );

  if (!receiverId) return;

  // send message event
  io.to(chat._id.toString()).emit("getMessage", {
    _id: message._id,
    content: message.content,
    sender: message.sender,
    chat: chat._id,
    createdAt: message.createdAt,
  });

  // notification
  io.to(receiverId.toString()).emit("getNotification", {
    type: "message",
    sender: req.user.id,
    chatId: chat._id,
    createdAt: new Date(),
  });
}

module.exports = {
  sendLikeNotification,
  sendCommentNotification,
  followNotification,
  sendMessageNotification,
};
