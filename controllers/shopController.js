const Shop = require("../models/ShopModel");

const catchAsync = require("../utils/catchAsync");

exports.getAllShops = catchAsync(async (req, res, next) => {
	const shops = await Shop.find({});

	res.status(200).json({
		status: "success",
		shops,
	});
});

exports.getShopInfo = catchAsync(async (req, res, next) => {
	res.status(200).json({
		status: "success",
		shop: req.user,
	});
});
