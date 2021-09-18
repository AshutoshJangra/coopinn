const mongoose = require("mongoose");

const Reward = require("./RewardModel");
const Shop = require("./ShopModel");

// let s;

const transactionSchema = new mongoose.Schema({
	sellerName: {
		type: String,
		required: true,
		trim: true,
	},
	bill: {
		type: Number,
		required: true,
	},
	custNumber: {
		type: Number,
		required: true,
	},
	reward: {
		type: Number,
		required: true,
		default: 3,
	},
	debit: {
		type: Number,
		default: 0,
	},
	date: {
		type: Date,
		default: Date,
	},
});

// transactionSchema.pre("save", async function(next) {
// 	try {
// 	} catch (e) {
// 		console.log(e);
// 	}
// 	next();
// });

transactionSchema.post("save", async function(doc, next) {
	const s = await Shop.find({ sellerName: this.sellerName });
	const sl = this.bill + s[0].totalSale;
	const rg =
		(this.reward / 100) * (this.bill - this.debit) + s[0].totalRewardGiven;
	const rc = this.debit + s[0].rewardToClaim;

	await Shop.updateOne(
		{ sellerName: this.sellerName },
		{
			totalRewardGiven: rg,
			totalSale: sl,
			rewardToClaim: rc,
		}
	);

	const u = await Reward.find({
		number: this.custNumber,
		shopName: this.sellerName,
	});

	const b = this.bill + u[0].totalShopping;

	//reward calculation debit/credit
	const temp = u[0].totalRewards - this.debit;
	const r = (this.reward / 100) * (this.bill - this.debit) + temp;

	await Reward.updateOne(
		{ number: this.custNumber, shopName: this.sellerName },
		{
			totalRewards: r,
			totalShopping: b,
		}
	);

	next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
