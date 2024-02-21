const express = require("express");
const {UserController} = require("../controllers");
const { AuthMiddleware } = require("../middleware");

const router = express.Router();

router.route("/").get(AuthMiddleware.protect, UserController.allUsers);
router.route("/").post(AuthMiddleware.validateRegisterUser,UserController.registerUser);
router.post("/login", UserController.authUser);

module.exports = router;
