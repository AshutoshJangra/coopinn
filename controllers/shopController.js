const Shop = require("../models/ShopModel");
const Transaction = require("../models/TransactionModel");

const catchAsync = require("../utils/catchAsync");

exports.getAllShops = catchAsync(async (req, res, next) => {
	const shops = await Shop.find({});

	res.status(200).json({
		status: "success",
		shops,
	});
});

exports.getShopInfo = catchAsync(async (req, res, next) => {
	const trans = await Transaction.find({
		sellerName: req.user.sellerName,
	})
		.sort({ date: -1 })
		.limit(30);

	res.status(200).json({
		status: "success",
		shop: req.user,
		transactions: trans,
	});
});
