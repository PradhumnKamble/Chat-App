const express = require("express");
const {MessageController} = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

const router = express.Router();

router.route("/:chatId").get(AuthMiddleware.protect, MessageController.allMessages);
router.route("/").post(AuthMiddleware.protect, MessageController.sendMessage);

module.exports = router;
