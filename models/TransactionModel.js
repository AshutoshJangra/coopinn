const mongoose = require("mongoose");

const User = require("./UserModel");
const Shop = require("./ShopModel");

let s;

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

	debit: {
		type: Number,
		default: 0,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

transactionSchema.pre("save", async function(next) {
	const u = await User.find({ userNum: this.custNumber });
	s = await Shop.find({ sellerName: this.sellerName });
	const b = this.bill + u[0].totalShopping;

	//reward calculation debit/credit
	const temp = u[0].totalRewards - this.debit;
	const r = (s[0].rewardPercentage / 100) * (this.bill - this.debit) + temp;

	await User.updateOne(
		{ userNum: this.custNumber },
		{
			totalShopping: b,
			totalRewards: r,
		}
	);

	next();
});

transactionSchema.post("save", async function(doc, next) {
	try {
		const sl = this.bill + s[0].totalSale;
		const rg =
			(s[0].rewardPercentage / 100) * (this.bill - this.debit) +
			s[0].totalRewardGiven;
		const rc = this.debit + s[0].rewardToClaim;

		const su = await Shop.updateOne(
			{ sellerName: this.sellerName },
			{
				totalRewardGiven: rg,
				totalSale: sl,
				rewardToClaim: rc,
			}
		);
	} catch (e) {
		console.log(e);
	}

	next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;