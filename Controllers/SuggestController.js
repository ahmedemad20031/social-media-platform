const User = require("../model/User");

const Follow = require("../model/Follow");
exports.GetSuggestedUsers = async function (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const userId = req.user.id;

    const following = await Follow.find({ follower: userId });

    const followingIds = following.map((f) => f.following);

    const users = await User.find({
      _id: {
        $ne: userId,
        $nin: followingIds,
      },
    })
      .select("-password -otp -otpExpire -otpLastSentAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      message: "Users Found",
      data: { users },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
