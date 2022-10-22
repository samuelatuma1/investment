const express = require("express");
const transactionRoute = express.Router();
const {transactionValidator} = require("../middlewares/transaction.middleware.js");
const {ValidateToken} = require("../middlewares/token.middleware.js");
const {TransactionController} = require("../controllers/transaction.controller.js");
const {AccountService} = require("../services/account.service.js");
const {TransactionService} = require("../services/transaction.service.js");
const {InvestmentService} = require("../services/investment.service.js");
const {AuthService} = require("../services/auth.service.js");
const {Mail} = require("../services/mail.service.js");


const mailServiceProvider = process.env.service;
const email_username = process.env.email_username;
const email_password = process.env.email_password;

const transaction = new TransactionController(new AccountService(), 
                        new TransactionService(), new InvestmentService(),
                        new AuthService(), 
                        new Mail(mailServiceProvider, email_username, email_password)
                        );

// Route transaction
transactionRoute.route("/create")
    .post(ValidateToken.validateToken, 
        transactionValidator, transaction.createTransaction)

transactionRoute.route("/gettransactions")
    .get(ValidateToken.validateToken, transaction.getUserTransactions);

transactionRoute.route("/update/:transactionId")
        .patch(ValidateToken.validateToken, transaction.updateUserTransaction);

transactionRoute.route("/filtertransactions")
        .get(ValidateToken.validateToken, transaction.retrieveTransactions);
        
module.exports = {transactionRoute};
