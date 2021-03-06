const User = require("../models/UserModel");
const Reward = require("../models/RewardModel");
const Transaction = require("../models/TransactionModel");

const catchAsync = require("../utils/catchAsync");

exports.getPublicUser = catchAsync(async (req, res) => {
	const number = req.query.number * 1;
	const code = req.query.code * 1;

	const user = await User.findOne({ userNum: number }).populate("rewards");

	if (user && user.passcode === code) {
		const trans = await Transaction.find({ custNumber: number })
			.sort({ date: -1 })
			.limit(20);

		res.status(200).json({
			status: "success",
			user,
			transactions: trans,
		});
	} else {
		res.status(404).json({
			status: "Error",
			msg: "Passcode is Incorrect !",
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
	const user = await Reward.findOne({
		shopName: req.user.sellerName,
		number: req.params.id,
	});

	if (!user) {
		const temp = await User.findOne({ userNum: req.params.id });
		if (!temp) {
			const u = await User.create({
				userNum: req.params.id,
			});

			const r = await new Reward({
				number: req.params.id,
				shopName: req.user.sellerName,
				passcode: u.passcode,
			});

			u.rewards.push(r);

			await u.save();

			await r.save();

			res.status(200).json({
				status: "success",
				user: r,
			});
		} else {
			const r = await new Reward({
				number: req.params.id,
				shopName: req.user.sellerName,
				passcode: temp.passcode,
			});

			await r.save();
			await temp.rewards.push(r);

			await temp.save();
			res.status(200).json({
				status: "success",
				temp,
			});
		}
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
