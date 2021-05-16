const User = require("../models/UserModel");

const catchAsync = require("../utils/catchAsync");

exports.getPublicUser = catchAsync(async (req, res) => {
	const number = req.query.number * 1;
	const code = req.query.code * 1;

	const user = await User.findOne({ userNum: number });

	if (user && user.passcode === code) {
		console.log("inside get public");
		res.status(200).json({
			status: "success",
			user,
		});
	} else {
		res.status(404).json({
			status: "Error",
			msg: "Passcode is Incorrect!",
		});
	}
});

exports.createUser = catchAsync(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		status: "success",
		user,
	});
});

exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ userNum: req.params.id });

	if (!user) {
		const u = await new User({ userNum: req.params.id });
		await u.save();

		res.status(200).json({
			status: "success",
			user: u,
		});
	} else {
		res.status(200).json({
			status: "success",
			user,
		});
	}
});

exports.updateUser = (req, res) => {
	res.status(404).json({
		status: "Error",
		msg: "Route is not defined",
	});
};

exports.deleteUser = (req, res) => {
	res.status(404).json({
		status: "Error",
		msg: "Route is not defined",
	});
};
