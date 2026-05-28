const Follow = require("../model/Follow");

const User = require("../model/User");

const Notification = require("../model/Notification");

const { followNotification } = require("../utils/NotificationService");
exports.CreateFollow = async function (req, res) {
  try {
    const userId = req.user.id;
    const followId = req.body.followId;

    if (!followId) {
      return res.status(400).json({ message: "Following Not Found" });
    }

    if (userId === followId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: followId,
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "Already following this user",
      });
    }

    const follow = await Follow.create({
      follower: userId,
      following: followId,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followId },
    });

    await User.findByIdAndUpdate(followId, {
      $addToSet: { followers: userId },
    });

    const receiver = await User.findById(followId);

    if (receiver && userId.toString() !== followId.toString()) {
      await Notification.create({
        sender: userId,
        receiver: followId,
        type: "follow",
      });

      await followNotification(req, receiver);
    }

    return res.status(200).json({
      message: "Follow successfully",
      data: follow,
    });
  } catch (error) {
    console.log("FOLLOW ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
exports.CreateUnFollow = async function (req, res) {
  try {
    const userId = req.user.id;
    const followId = req.body.followId;

    const follow = await Follow.findOneAndDelete({
      follower: userId,
      following: followId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Following Not Found" });
    }
    return res.status(200).json({ message: "Unfollow successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.GetFollowers = async function (req, res) {
  try {
    const userId = req.user.id;

    //الناس اللي بتتابع الشخص ده
    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "firstName lastName profileImage",
    );

    return res.status(200).json({
      message: "Followers Found",
      data: followers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.GetFollowing = async function (req, res) {
  try {
    const userId = req.user.id;

    //الناس اللي الشخص ده متابعها
    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "firstName lastName profileImage",
    );

    return res
      .status(200)
      .json({ message: "Following Found", data: following });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
