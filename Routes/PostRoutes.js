const router = require("express").Router();

const {
  CreatePosts,
  CreateLikes,
  CreateDisLikes,
  CreateComments,
  GetPosts,
  getAllLikes,
  getAllDisLikes,
  getAllComments,
  updatePosts,
  deletePosts,
  countPosts,
  deletecomment,
  SearchPosts,
} = require("../Controllers/PostController");

const uploader = require("../utils/uploader");

const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

//create
router.post("/", AuthMiddleware, uploader.single("image"), CreatePosts);

router.patch("/:id/like", AuthMiddleware, CreateLikes);
router.patch("/:id/dislike", AuthMiddleware, CreateDisLikes);

router.post("/:id/comment", AuthMiddleware, CreateComments);

router.get("/", GetPosts);
router.get("/search/:id", AuthMiddleware, SearchPosts);
router.get("/:id/likes", getAllLikes);
router.get("/:id/dislikes", getAllDisLikes);
router.get("/:id/comments", getAllComments);
router.get("/count", AuthMiddleware, countPosts);

//update
router.put("/:id", AuthMiddleware, updatePosts);

//delete
router.delete("/:id", AuthMiddleware, deletePosts);

router.delete("/:id/comment", AuthMiddleware, deletecomment);

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjExZTkxYjVhMjRjZjFkZmQ2Y2M3YiIsImlhdCI6MTc3NzQwOTgwNSwiZXhwIjoxNzc4MDE0NjA1fQ.-aglAP2YXda0GFH7wMoU268qXUwTaczMZpHpZB-_EQ4
