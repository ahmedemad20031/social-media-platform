const router = require("express").Router();
const { GetSuggestedUsers } = require("../Controllers/SuggestController");
const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

router.get("/", AuthMiddleware, GetSuggestedUsers);

module.exports = router;
