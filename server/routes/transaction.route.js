const express = require("express");
const transactionRoute = express.Router();
const {transactionValidator} = require("../middlewares/transaction.middleware.js");
const {ValidateToken} = require("../middlewares/token.middleware.js");
const {TransactionController} = require("../controllers/transaction.controller.js");
const {AccountService} = require("../services/account.service.js");
const {TransactionService} = require("../services/transaction.service.js");
const transaction = new TransactionController(new AccountService(), new TransactionService());

// Route transaction
transactionRoute.route("/create")
    .post(ValidateToken.validateToken, 
        transactionValidator, transaction.createTransaction)

transactionRoute.route("/gettransactions")
    .get(ValidateToken.validateToken, transaction.getUserTransactions);

module.exports = {transactionRoute};
