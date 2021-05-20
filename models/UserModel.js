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
		default: 1519,
	},
});

userSchema.pre("save", function(next) {
	const code = Math.random()
		.toString()
		.substr(2, 4);
	this.passcode = parseInt(code);

	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
