const AppError = require("./../utils/AppError");

const sendDevError = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const handleDuplicatesFieldDB = (err) => {
	const value = err.keyValue.userNum;

	const msg = `Duplicate field value ${value}: Please use another value!`;

	return new AppError(msg, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const msg = `Invalid Input Data. ${errors.join(". ")}`;

	return new AppError(msg, 400);
};

const handleJWTError = () =>
	new AppError("Invalid Token! Please login again", 401);

const handleJWTExpiredError = () =>
	new AppError("Expired Token! Please login again", 401);

const sendProdError = (err, res) => {
	// Operational trusted error: Send message to Client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});

		// Programming error
	} else {
		// Log error
		console.error("Error 💣 ", err);

		// Send Generic Msg
		res.status(500).json({
			status: "Error",
			message: "Something went wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";

	if (process.env.NODE_ENV === "development") {
		sendDevError(err, res);
	} else if (process.ens.NODE_ENV === "production") {
		let error = { ...err };

		if (error.code === 11000) error = handleDuplicatesFieldDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError();
		if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendProdError(error, res);
	}
};
