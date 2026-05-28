const router = require("express").Router();

const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

const {
  CreateMessage,
  GetAllMessages,
  updateStatus,
} = require("../Controllers/MessageController");

router.post("/", AuthMiddleware, CreateMessage);

router.get("/:id", AuthMiddleware, GetAllMessages);

//update status of message to read
router.patch("/:id", AuthMiddleware, updateStatus);

module.exports = router;
