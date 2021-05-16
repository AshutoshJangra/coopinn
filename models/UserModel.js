const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	userNum: {
		type: Number,
		Required: true,
		unique: true,
	},
	totalShopping: {
		type: Number,
		default: 0,
	},
	totalRewards: {
		type: Number,
		default: 0,
	},
	passcode: {
		type: Number,
		default: 1111,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
