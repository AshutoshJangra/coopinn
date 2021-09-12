const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	userNum: {
		type: Number,
		Required: true,
		unique: true,
	},

	passcode: {
		type: Number,
		default: null,
	},

	rewards: [{ type: Schema.Types.ObjectId, ref: "Reward" }],
});

userSchema.pre("save", function(next) {
	const code = Math.random()
		.toString()
		.substr(2, 4);

	if (!this.passcode) {
		this.passcode = parseInt(code);
	}
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
