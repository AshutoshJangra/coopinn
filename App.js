const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();
var cors = require("cors");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const transactionRouter = require("./router/Transaction");
const userRouter = require("./router/User");
const shopRouter = require("./router/Shop");

// middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());
app.use(compression());
app.use(express.json());

//router
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shops", shopRouter);

app.all("*", (req, res, next) => {
	// res.status(404).json({
	// 	status: "Fail",
	// 	message: `Can't find ${req.originalUrl} on this server!`,
	// });

	next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

//for server
module.exports = app;
