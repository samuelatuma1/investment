const {validationResult} = require("express-validator");

// Route /transaction
class TransactionController{
    constructor(accountService /*: IAccountService */, transactionService /*: ITransactionService */){
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    /** 
     * @method Post /create
     * @protected (userId in req.userId)
     * @payload {
        * amount: number,
        * status: enum {pending, approved, rejected} default pending
        * currency: string default dollar
        * desc: string default No description
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
}

module.exports = {TransactionController};