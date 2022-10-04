const {validationResult} = require("express-validator");
const {IInvestmentService} = require("../services/investment.service");

// Route /transaction
class TransactionController{
    /*Private readonly */transactionService;
    /*Private readonly */accountService;
    /*Private readonly */investmentService;
    /*Private readonly */ authService;

    /**
     * 
     * @param {*} accountService 
     * @param {*} transactionService 
     * @param {IInvestmentService} investmentService 
     */
    constructor(accountService /*: IAccountService */, transactionService /*: ITransactionService */,
    investmentService /*: IInvestmentService */,
    authService /**IUserService */
    ){
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.investmentService = investmentService;
        this.authService = authService;
    }
    
    /** 
     * @method Post /create
     * @protected (userId in req.userId)
     * @payload {
        * amount: number,
        * status: enum {pending, approved, rejected} default pending
        * currency: string default dollar
        * desc: string default No description,
        * investmentId: ObjectId
     * }
     * @params {}, @query {}
     * @returns {transaction: TransactionObject}
    */
    createTransaction = async (req/*: Request */, res /*:Response */) => {
        try{
            const formErrors = validationResult(req).errors;
            if(formErrors.length > 0)
                return res.status(200).json({formErrors});

            const userId /*: ObjectId */= req.userId
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);
        
            if(userAcct !== null){
                const acctId /*:ObjectId */ = userAcct._id;
                
                const transactionObject /*: TransactionDTO */ = req.body;

                // Get investmentId and verify it exists
                const investment /*InvestmentModel?*/ = await this.investmentService.retrieveInvestment(transactionObject.investmentId);
               
                if (investment === null){
                    return res.status(403).json({error: "InvestmentId does not exist"});
                }

                // Get investmentAmount and currency
                const amount /**:number */ = investment.amount;
                const currency /**: string */ = investment.currency;
                transactionObject.amount = amount;
                transactionObject.currency = currency;
                // add amount to transactionoBJECT
                const newTransaction /*: TransactionModel */ = await this.transactionService
                                .createTransaction(acctId, transactionObject);
                return res.status(201).json(newTransaction);
            }
            return res.status(403).json({error: "Transaction Error: No Account for user"});
        } catch(err) {
            console.log(err)
            return res.status(500).json({error: err.message})
        }
    }

    /** 
     * @method get /gettransactions
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {acctTransactions: List<Transaction>}
    */
    getUserTransactions = async (req /*:Request */, res /*: Response */) => {
        try{
            const userId /*: ObjectId */= req.userId
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);
            
            if(userAcct !== null){
                const acctId /*:ObjectId */ = userAcct._id;
                const acctTransactions /*: List<Transaction> */ = await this.transactionService.getUserTransactions(acctId);
                return res.status(200).json({acctTransactions});
            }
        } catch(err){
            console.log(err.message);
            return res.status(500).json({error: err.message});
        }
    }

    /** 
     * @desc Allows only admin update transactions
     * @method patch /update/:transactionId
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {updated: boolean}
    */
    updateUserTransaction = async (req /**Request */, res /**: Response */) => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const params /**: Object<string, string> */ = req.params;
            const transactionId /**:ObjectId */ = params.transactionId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            const updateData /**: Object<string, string> */ = req.body;

            if(!isAdmin){
                return res.status(403).json({message: "You are not permitted to modify transaction"});
            }
            
            const transactionUpdated /**: boolean */= await this.transactionService.updateUserTransaction(transactionId, updateData);
            if(transactionUpdated){
                return res.status(200).json({updated: transactionUpdated});
            }
            return res.status(400).json({updated: transactionUpdated})
            
        }
        catch(err /**:Excetption */){
            console.log(err)
            return res.status(500).json({error: err.message})
        }

    }

}

module.exports = {TransactionController};