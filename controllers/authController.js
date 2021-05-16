const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Shop = require("../models/ShopModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const {
		name,
		sellerName,
		mobile,
		email,
		password,
		passwordConfirm,
		rewardPercentage,
	} = req.body;

	const newShop = await Shop.create({
		name,
		sellerName,
		mobile,
		email,
		password,
		passwordConfirm,
		rewardPercentage,
	});

	// JWT Token sign
	const token = signToken(newShop._id);

	res.status(200).json({
		status: "success",
		token,
		data: {
			shop: newShop,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) check if email and password exists
	if (!email || !password) {
		return next(new AppError("Please provide email and password", 400));
	}

	// 2) Check if user exists & password is correct
	const shop = await Shop.findOne({ email }).select("+password"); // Password select field is false in model So have to explicitly select it
	const correct = await shop.correctPassword(password, shop.password); // compare func , method in shop model

	if (!shop || !correct) {
		return next(new AppError("Incorrect Email & Password", 401));
	}
	// 3) If everything ok Send JWT to client
	const token = signToken(shop._id);

	res.status(200).json({
		status: "success",
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	//1) Get the Token and check if it is there
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next(
			new AppError(
				"You are not loged in! Please login to get access",
				401
			)
		);
	}

	//2) Verify the token
	const decoded = await promisify(jwt.verify)(
		JSON.parse(token),
		process.env.JWT_SECRET
	);

	//3) Check if user still exists
	const freshUser = await Shop.findById(decoded.id);
	if (!freshUser) {
		return next(
			new AppError("The user belonging to this no longer exist.", 401)
		);
	}

	//4) Check if user changed the password after token generation
	if (freshUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("Shop recently changed password! Please login again."),
			401
		);
	}

	//5) Grant access to protected routes
	req.user = freshUser;
	next();
});
