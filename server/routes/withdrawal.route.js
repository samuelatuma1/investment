const express = require("express");
const {ValidateToken} = require("../middlewares/token.middleware.js");
const {AccountService} = require("../services/account.service.js");
const {TransactionService} = require("../services/transaction.service.js");
const {InvestmentService} = require("../services/investment.service.js");
const {AuthService} = require("../services/auth.service.js");
const {Mail} = require("../services/mail.service.js");
const {WithdrawalService} = require("../services/withdrawal.service.js");


const {WithdrawalController} = require("../controllers/withdrawal.controller.js");

const withdrawalController /**WithdrawalController*/ = new WithdrawalController(
    new WithdrawalService(), 
    new TransactionService(),
    new AccountService()
)
const withdrawalRoute /**Router */ = express.Router();

withdrawalRoute.route('/withdraw')
    .post(ValidateToken.validateToken, withdrawalController.withdraw);

withdrawalRoute.route("/getwithdrawablebalance")
    .get(ValidateToken.validateToken, withdrawalController.getWithdrawableAndPendingBalance);
module.exports = {withdrawalRoute};