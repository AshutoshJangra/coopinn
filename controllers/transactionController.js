const fs = require("fs");
const Transaction = require("../models/TransactionModel");

const catchAsync = require("../utils/catchAsync");

exports.getAllTransactions = catchAsync(async (req, res, next) => {
	if (req.query.custNumber) {
		req.query.custNumber = req.query.custNumber * 1;
	}

	const transactions = await Transaction.find(req.query);

	res.status(200).json({
		status: "success",
		count: transactions.length,
		data: {
			transactions,
		},
	});
});

exports.createTransaction = catchAsync(async (req, res, next) => {
	const data = {
		bill: req.body.bill,
		custNumber: req.body.custNumber,
		debit: req.body.debit,
		sellerName: req.user.sellerName,
		reward: req.body.reward,
	};

	const newTran = await Transaction.create(data);
	res.status(200).json({
		status: "success",
		data: {
			transaction: newTran,
		},
	});
});
