const mongoose = require("mongoose");
const { Schema } = mongoose;

const rewardSchema = new Schema({
	totalRewards: {
		type: Number,
		default: 0,
	},
	totalShopping: {
		type: Number,
		default: 0,
	},
	number: {
		type: Number,
		Required: true,
		unique: false,
	},
	shopName: {
		type: String,
	},
});

// rewardSchema.pre("save", function(next) {
// 	const code = Math.random()
// 		.toString()
// 		.substr(2, 4);
// 	this.passcode = parseInt(code);

// 	next();
// });

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
