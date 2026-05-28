const router = require("express").Router();

const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

const NotificationController = require("../Controllers/NotificationController");

router.get("/", AuthMiddleware, NotificationController.getAllnotifications);
router.get(
  "/unread_count",
  AuthMiddleware,
  NotificationController.unreadNotification,
);

router.put("/read", AuthMiddleware, NotificationController.UpdateNotification);

router.delete(
  "/:id",
  AuthMiddleware,
  NotificationController.deleteNotification,
);

module.exports = router;
