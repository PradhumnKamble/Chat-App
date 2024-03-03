const express = require("express");
const {UserController} = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

const router = express.Router();

router.route("/").get(AuthMiddleware.protect, UserController.allUsers);

router.route("/fetchUsers").get(AuthMiddleware.protect,UserController.getAll);

router.route("/:id/contacts").get(AuthMiddleware.protect,UserController.getContacts);

router.route("/:id/contacts").patch(AuthMiddleware.protect,UserController.addToContacts);

router.route("/").post(AuthMiddleware.validateRegisterUser,UserController.registerUser);
router.post("/login", UserController.authUser);

module.exports = router;
