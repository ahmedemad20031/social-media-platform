const Notification = require("../model/Notification");

exports.getAllnotifications = async function (req, res) {
  try {
    const notifications = await Notification.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName profileImage");
    return res
      .status(200)
      .json({ message: "Notifications", data: notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteNotification = async function (req, res) {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.unreadNotification = async function (req, res) {
  try {
    const notifications = await Notification.countDocuments({ isRead: false });
    return res
      .status(200)
      .json({ message: "Notification seen", data: notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.UpdateNotification = async function (req, res) {
  try {
    const notifications = await Notification.find({
      isRead: false,
      receiver: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id");

    const ids = notifications.map((n) => n._id);

    await Notification.updateMany(
      {
        _id: { $in: ids },
        receiver: req.user.id,
      },
      {
        $set: { isRead: true },
      },
    );

    return res.status(200).json({
      message: "Latest 5 notifications marked as seen",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
