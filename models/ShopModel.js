const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const shopSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter your name"],
	},
	sellerName: {
		type: String,
		required: true,
	},
	mobile: {
		type: Number,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false, // To exclude the password field in Output (Get Shops)
	},

	passwordConfirm: {
		type: String,
		required: [true, " Please confirm your password"],
		validate: {
			// only works on save & create
			validator: function(el) {
				return el === this.password;
			},
			message: " Passwords are not the same!",
		},
	},

	passwordChangedAt: Date,

	rewardPercentage: {
		type: Number,
		required: true,
	},

	totalRewardGiven: {
		type: Number,
		default: 0,
	},
	totalSale: {
		type: Number,
		default: 0,
	},
	rewardToClaim: {
		type: Number,
		default: 0,
	},
});

shopSchema.pre("save", async function(next) {
	// If password is not modified Do Nothing
	if (!this.isModified("password")) return next();

	// if modified Hash the password
	this.password = await bcrypt.hash(this.password, 12);

	// delete the confirm password feild to make it not persistant in DB
	this.passwordConfirm = undefined;

	next();
});

shopSchema.methods.correctPassword = async function(
	candidatePassword,
	shopPassword
) {
	return await bcrypt.compare(candidatePassword, shopPassword);
};

shopSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimeStamp;
	}

	// False means NOT changed
	return false;
};

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
