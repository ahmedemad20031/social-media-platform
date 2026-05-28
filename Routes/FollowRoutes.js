const router = require("express").Router();

const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

const {
  CreateFollow,
  GetFollowers,
  CreateUnFollow,
  GetFollowing,
} = require("../Controllers/FollowController");

router.post("/Follow", AuthMiddleware, CreateFollow);

router.post("/UnFollow", AuthMiddleware, CreateUnFollow);

router.get("/Following", AuthMiddleware, GetFollowing);

router.get("/Followers", AuthMiddleware, GetFollowers);

module.exports = router;
