const {Transaction} = require("../models/transaction.model");
const {AccountService} = require("./account.service.js");
class ITransactionService {
    /**
     * @desc Creates a new transaction
     */
    createTransaction = async (AccountId/* ObjectId */, transaction /*: TransactionObject */ ) /*: Transaction */=> {}
}

/*
interface TransactionObject {
    amount: number;
    desc: string;
    currency: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    status: enum {pending, approved, rejected}
}
*/
class TransactionService /*: implements ITransactionService */ {
    balanceAfterTransactionPositive = async (AccountId/* ObjectId */, transaction /*: TransactionObject */) => {
        // Verify transaction does not reduce balance to below 0
        const userTransactions /*: List<Transaction> */ = await Transaction.where({acctId: AccountId});
        if(transaction.amount > 0){
            return true;
        }
        const userTransactionsBal /*: number */= userTransactions
        .reduce((transSum /*: number */, currTransaction /*: Transaction */) =>
        transSum + currTransaction.amount, 0);
        
        console.log({userTransactionsBal})
        const balAfterCurrTransaction /*: number */ = userTransactionsBal + transaction.amount;
        console.log({balAfterCurrTransaction})
        if(balAfterCurrTransaction <= 0){
            return false;
        }
        return true;
    } 
    
    createTransaction = async (AccountId/*: ObjectId */, transaction /*: Transaction */ ) => {
        try{
            console.log("---------------------------------------------")
            console.log({transaction})
            console.log("---------------------------------------------")
            const {amount, desc, status, currency, investmentId} = transaction /*: Object<string, object> */;
            
            const newTransaction = new Transaction({ acctId: AccountId, amount, desc, status, currency, investmentId });
            const balanceAfterTransactionPositive = await this.balanceAfterTransactionPositive(AccountId, transaction);

            if(!balanceAfterTransactionPositive){
                throw new Error("Insufficent fund");
            }
            return await newTransaction.save();
        } catch(err){
            console.log(err);
            throw new Error(err.message);
        }
    }

    /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @returns {List<TransactionModel>} for accountId
     */
    getUserTransactions = async (acctId /*:ObjectId */) => {
        try{
            const transactions /*: List<TransactionModel> */= await Transaction.where({acctId: acctId}).populate("investmentId");
            return transactions;

        } catch(err){
            console.log(err);
            throw new Error(err.message);
        }
    }
    /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @param {enum["pending", "approved", "rejected"]} status 
     * @returns {List<TransactionModel>} with status matching status
     */
    filterUserTransactionsByStatus = async (acctId /*:ObjectId */, status /*:string */="pending") => 
    {
        try{
            const transactions /*: List<TransactionModel> */= await Transaction.where({acctId, status});
            return transactions;

        } catch(err){
            console.log(err);
            throw new Error(err.message);
        }
    }
    /**
     * 
     * @param {ObjectId} transactionId 
     * @param {ObjectId} acctId
     * @param {Object} updateData
     */
    updateUserTransaction = async (transactionId /*:ObjectId */,updateData /*: Object */ = {}) => {
        const transaction /*: TransactionModel | null */= await Transaction.findOne({_id: transactionId})
        let updatedTransaction = true
        if(transaction != null){
            await Transaction.updateOne({_id: transactionId}, updateData);  
        }
        else{
            updatedTransaction = false; 
        }
        return updatedTransaction;
    }
}

module.exports = {TransactionService};