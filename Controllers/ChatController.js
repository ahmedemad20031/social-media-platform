const Chat = require("../model/Chat");

exports.CreateChat = async function (req, res) {
  try {
    const { userId } = req.body;
    const currentUser = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    if (userId === currentUser) {
      return res
        .status(400)
        .json({ message: "You cannot start a conversation with yourself" });
    }
    let isCreated = false;

    // check existing chat
    let chat = await Chat.findOne({
      members: { $all: [userId, currentUser] },
    });

    // create if not exists
    if (!chat) {
      chat = await Chat.create({
        members: [userId, currentUser],
      });
      isCreated = true;
    }

    chat = await chat.populate("members", "firstName lastName profileImage");

    // chat.lastMessage = await Chat.populate(chat.lastMessage, "content sender");

    return res.status(200).json({
      message: isCreated ? "Chat Created" : "Chat Already Exists",
      data: chat,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.GetAllChat = async function (req, res) {
  try {
    const currentuser = req.user.id;

    if (!currentuser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const chat = await Chat.find({ members: currentuser })
      .populate("members", "firstName lastName profileImage")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    if (chat.length === 0) {
      return res.status(404).json({ message: "No chat yet" });
    }

    return res.status(200).json({ message: "Chat Found", data: chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.GetChat = async function (req, res) {
  try {
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(400).json({ message: "ChatId is required" });
    }

    const chat = await Chat.findById({ _id: chatId })
      .populate("members", "firstName lastName profileImage")
      .populate("lastMessage", "content sender");

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    return res.status(200).json({ message: "Chat Found", data: chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.DeleteChat = async function (req, res) {
  try {
    const chatId = req.params.id;
    const currentuser = req.user.id;

    if (!currentuser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const chat = await Chat.findById({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }
    await Chat.findByIdAndDelete({ _id: chatId });
    return res.status(200).json({ message: "Chat Deleted", data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
