const express = require("express");
const Router = express.Router();
const shopController = require("../controllers/shopController");
const authController = require("../controllers/authController");

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);

Router.route("/").get(authController.protect, shopController.getShopInfo);

Router.route("/all").get(authController.protect, shopController.getAllShops);

module.exports = Router;
authController.protect, shopController.getShopInfo;
