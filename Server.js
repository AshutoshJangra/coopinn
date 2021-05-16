const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
	//stop the process
	console.log("Uncaught Exception 🔥 Shutting Down...");

	console.log(err.name, err.message);

	// Exit the app
	process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./App");

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then((con) => {
		console.log("DB Connection was successful");
	});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App is running on port ${port} `);
});

// Global Unhandled Rejection Error Handler
process.on("unhadledRejection", (err) => {
	//stop the process
	console.log("Unhandled Rejection 🔥 Shutting Down...");

	console.log(err.name, err.message);

	// First close the server pending calls then exit the app
	server.close(() => {
		process.exit(1);
	});
});
