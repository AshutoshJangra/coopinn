const express = require("express");
const Router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

Router.route("/")
	.get(userController.getPublicUser)
	.post(userController.createUser);

Router.route("/:id")
	.get(authController.protect, userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = Router;
