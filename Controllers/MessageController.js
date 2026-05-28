const Message = require("../model/Message");
const Chat = require("../model/Chat");
const Notification = require("../model/Notification");

const { MessageValidation } = require("../Validations/MessageValidations");

const { getIO, onlineUsers } = require("../utils/socket");

const { sendMessageNotification } = require("../utils/NotificationService");

exports.CreateMessage = async function (req, res) {
  try {
    const { error, value } = MessageValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(404).json({ message: error.details[0].message });
    }

    const chat = await Chat.findById(value.chat);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    if (!chat.members.some((m) => m.toString() === req.user.id.toString())) {
      return res.status(403).json({
        message: "You are not allowed to send message in this chat",
      });
    }

    let message = await Message.create({
      ...value,
      sender: req.user.id,
    });

    message = await message.populate(
      "sender",
      "firstName lastName profileImage",
    );

    await Chat.findByIdAndUpdate(value.chat, {
      lastMessage: message._id,
    });

    chat.members
      .filter((m) => m.toString() !== req.user.id.toString())
      .forEach(async (receiverId) => {
        await Notification.create({
          receiver: receiverId,
          sender: req.user.id,
          message: message.content,
          type: "message",
        });
      });

    const io = getIO();

    io.to(value.chat.toString()).emit("getMessage", {
      _id: message._id,
      content: message.content,
      sender: message.sender,
      chat: value.chat,
      createdAt: message.createdAt,
    });

    return res.status(200).json({
      message: "Message Created",
      data: message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.GetAllMessages = async function (req, res) {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // check user is member
    if (!chat.members.includes(userId)) {
      return res.status(403).json({
        message: "You are not allowed to access this chat",
      });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })

      .populate("sender", "firstName lastName profileImage");

    return res.status(200).json({
      message: "Messages Found",
      data: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateStatus = async function (req, res) {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Message.findById(messageId).populate("chat");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // check user is in chat
    if (!message.chat.members.includes(userId)) {
      return res.status(403).json({
        message: "You are not allowed to update this message",
      });
    }

    message.status = true;
    await message.save();

    return res.status(200).json({
      message: "Message status updated",
      data: message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
