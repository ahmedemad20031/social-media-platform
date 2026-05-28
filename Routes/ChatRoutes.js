const router = require("express").Router();

const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

const {
  CreateChat,
  GetAllChat,
  GetChat,
  DeleteChat,
} = require("../Controllers/ChatController");

//getall
router.get("/", AuthMiddleware, GetAllChat);

//get by id
router.get("/:id", AuthMiddleware, GetChat);

//post
router.post("/", AuthMiddleware, CreateChat);

//delete
router.delete("/:id", AuthMiddleware, DeleteChat);

module.exports = router;
