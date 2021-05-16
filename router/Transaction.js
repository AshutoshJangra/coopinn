const express = require("express");
const Router = express.Router();
const transactionController = require("../controllers/transactionController");
const authController = require("../controllers/authController");

// Router.param("id", (req, res, next, val) => {
// 	// console.log(`Id is ${val}`) ;
// 	next();
// });

Router.route("/")
	.get(authController.protect, transactionController.getAllTransactions)
	.post(authController.protect, transactionController.createTransaction);

// Router.get("/:id", transactionController.getTransaction);

module.exports = Router;
