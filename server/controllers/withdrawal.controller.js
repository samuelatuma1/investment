const { IWithdrawalService } = require("../services/withdrawal.service.js");
const { IInvestmentService } = require("../services/investment.service.js");
const { ITransactionService } = require("../services/transaction.service.js");
const { IAccountService } = require("../services/account.service.js");

// [ApiController]
//[Route("/withdrawal")]
class WithdrawalController{
    /** private readonly IWithdrawalService withdrawalService */
    withdrawalService;
    /** private readonly ITransactionService transactionService*/
    transactionService;
    /** private readonly IAccountSerice accountService */
    accountService;

    /**
     * 
     * @param {IWithdrawalService} withdrawalService 
     * @param {ITransactionService} transactionService 
     * @param {IAccountService} accountService
     */
    constructor(withdrawalService /**IWithdrawalService */, 
                transactionService /**ITransactionService */,
                accountService /**IAccountService */){
        this.withdrawalService = withdrawalService;
        this.transactionService = transactionService;
        this.accountService = accountService
    }
    /** 
     * @method POST /withdraw
     * @protected (userId in req.userId)
     * @payload {
     *  amount: number,
     *  currency: string
     * }
     * @params {}, @query {}
     * @returns {acctTransactions: List<Transaction>}
    */
    withdraw = async (req /**Request */, res /**Response */ ) => {
        try{
            // 
            const {amount /**number */, currency = "" /** string */} = req.body;
            if(!amount || (typeof +amount !== "number" || currency.trim() === "")){
                
                return res.status(403).json({error: "Invalid amount or currency"});
            }
            // get all valid successful transactions
            const userId /*: ObjectId */ = req.userId;
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);

            if(userAcct == null){
                console.log("UserAcct is null")
                return res.status(403).json({error: "No user account for user"})
            }

            const acctId /**ObjectId */ = userAcct._id;
            const {withdrawableTransactions  /**TransactionModel[] */} = await this.transactionService
                        .retrieveWithdrawableTransactions(acctId);
            
            // withdraw
            const withdrawalData /**WithdrawalModel */= {
                acctId, userId, amount, currency
            }
            console.log({withdrawableTransactions});
            const withdraw /**: WithdrawModel */= await this.withdrawalService.withdraw(withdrawalData, withdrawableTransactions);
            if(withdraw !== null){
                return res.status(201).json({withdrawal: withdraw, created: true});
            }
            return res.status(200).json({created: false});
        } catch(err /**Error */){
            console.log(err)
            return res.status(500).json({error: err.message})
        }
    }
    
     /** 
     * @method GET /getwithdrawablebalance
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {{
            [key: string]: {
                availableWithdrawableBalance: number,
                pendingWithdrawableBalance: number
            }}
    */
    getWithdrawableAndPendingBalance = async (req /**Request*/, res /**Response */) => {
        // get all valid successful transactions
        const userId /*: ObjectId */ = req.userId;
        const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);

        if(userAcct == null){
            return res.status(403).json({error: "No user account for user"})
        }

        const acctId /**ObjectId */ = userAcct._id;
        const {withdrawableTransactions  /**TransactionModel[] */} = await this.transactionService
                    .retrieveWithdrawableTransactions(acctId);
        const getAllWithdrawableAndPendingBalance /**
            {
            [key: string]: {
                availableWithdrawableBalance: number;
                pendingWithdrawableBalance: number;
            }
         */ = await this.withdrawalService
            .getAllWithdrawableAndPendingBalance(withdrawableTransactions, acctId);
        return res.status(200).json({withdrawableAndPendingBalance: getAllWithdrawableAndPendingBalance})
    }
}

module.exports = {WithdrawalController}