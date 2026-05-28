const Post = require("../model/Post");

const User = require("../model/User");

const Notification = require("../model/Notification");

const {
  sendLikeNotification,
  sendCommentNotification,
} = require("../utils/NotificationService");

const {
  PostValidation,
  CommentValidation,
  UpdatePostValidation,
} = require("../Validations/PostValidations");
exports.CreatePosts = async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    //validation data
    const { error, value } = PostValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(404).json({ message: error.details[0].message });
    }
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const post = await Post.create({ ...value, user: userId, image });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "firstName lastName profileImage",
    );

    return res
      .status(200)
      .json({ message: "Post Created", data: { post: populatedPost } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.CreateLikes = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const post = await Post.findById({ _id: postId }).populate(
      "user",
      "firstName lastName profileImage",
    );
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (post.user.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot like your own post",
      });
    }
    const isdislike = post.dislikes.includes(userId);
    if (isdislike) {
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }
    await post.save();

    if (userId.toString() !== post.user.toString()) {
      await Notification.create({
        sender: userId,
        receiver: post.user,
        type: "like",
        postId: post._id,
      });

      sendLikeNotification(req, post);
    }

    return res.status(200).json({ message: "Post Liked", data: { post } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.CreateDisLikes = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const post = await Post.findById({ _id: postId }).populate(
      "user",
      "firstName lastName profileImage",
    );
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (post.user.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot like your own post",
      });
    }

    //check if user make like befor dis like
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    }
    const disLke = post.dislikes.includes(userId);
    if (disLke) {
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.dislikes.push(userId);
    }
    await post.save();
    //get username make like
    const username = await User.findById({ _id: userId })
      .select("firstName lastName")
      .lean();

    return res
      .status(200)
      .json({ message: "Post Disliked", data: { post, username } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};

exports.GetPosts = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.userId) {
      filter.user = req.query.userId;
    }

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName profileImage");

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      message: "Posts Found",
      data: {
        posts,
        totalPosts,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.CreateComments = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    //validation data
    const { error, value } = CommentValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(404).json({ message: error.details[0].message });
    }

    post.comments.push({ ...value, user: userId });

    await post.save();

    const comment = await Post.findById({ _id: postId })
      .populate("user", "firstName lastName profileImage")
      .populate("comments.user", "firstName lastName profileImage");

    if (userId.toString() !== post.user.toString()) {
      await Notification.create({
        sender: userId,
        receiver: post.user,
        type: "comment",
        postId: post._id,
      });

      sendCommentNotification(req, post, comment);
    }

    return res.status(200).json({ message: "Comment Created", data: comment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.getAllLikes = async function (req, res) {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const post = await Post.findById({ _id: postId }).populate(
      "likes",
      "firstName lastName profileImage",
    );
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    return res.status(200).json({
      message: "Likes Found",
      data: { likes: post.likes, count: post.likes.length },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.getAllDisLikes = async function (req, res) {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const post = await Post.findById({ _id: postId }).populate(
      "dislikes",
      "firstName lastName",
    );
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    return res.status(200).json({
      message: "DisLikes Found",
      data: { dislikes: post.dislikes, count: post.dislikes.length },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};

exports.getAllComments = async function (req, res) {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const post = await Post.findById({ _id: postId }).populate(
      "comments.user",
      "firstName lastName profileImage",
    );
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    return res.status(200).json({
      message: "Comments Found",
      data: {
        comments: post.comments,
        count: post.comments.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};

exports.updatePosts = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    if (!postId) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (!userId) {
      return res.status(404).json({ message: "User Not Found" });
    }

    //validation data
    const { error, value } = UpdatePostValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(404).json({ message: error.details[0].message });
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { ...value },
      { new: true },
    );
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    return res.status(200).json({ message: "Post Updated", data: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};

exports.deletePosts = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    console.log("POST ID:", postId);

    if (!postId) {
      return res.status(400).json({ message: "Post ID required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.countPosts = async function (req, res) {
  try {
    const userId = req.user.id;
    const count = await Post.countDocuments({ user: userId });
    return res.status(200).json({ message: "Posts Count", data: { count } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};

exports.deletecomment = async function (req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const commentIndex = post.comments.findIndex(
      (comment) => comment.user.toString() === userId.toString(),
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment Not Found" });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    return res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intrnal Server Error" });
  }
};
exports.SearchPosts = async function (req, res) {
  try {
    const search = req.params.id || "";
    if (!search || search.trim() === "") {
      return res.status(200).json({
        message: "No search query provided",
        data: [],
      });
    }

    const posts = await Post.find({
      title: {
        $regex: search.trim(),
        $options: "i",
      },
    }).populate("user", "firstName lastName profileImage");

    return res.status(200).json({
      message: "Posts Found",
      data: posts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
