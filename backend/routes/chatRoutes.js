const express = require("express");
const { ChatController } = require("../controllers");
const { AuthMiddleware , ChatMiddleware } = require("../middlewares");

const router = express.Router();

router.route("/").post(AuthMiddleware.protect, ChatController.accessChat);
router.route("/").get(AuthMiddleware.protect, ChatController.fetchChats);
router.route("/group").post(AuthMiddleware.protect, ChatMiddleware.validateCreateGroup,ChatController.createGroupChat);
router.route("/rename").put(AuthMiddleware.protect, ChatController.renameGroup);
router.route("/groupremove").put(AuthMiddleware.protect, ChatController.removeFromGroup);
router.route("/groupadd").put(AuthMiddleware.protect, ChatController.addToGroup);

module.exports = router;
