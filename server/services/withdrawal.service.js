const {Withdrawal} = require("../models/withdrawal.model.js");


/*
    Withdrawal => {
        acctId: ObjectId,
        userId: ObjectId,
        amount: number
    }
 */


class IWithdrawalService {
    /**
     * @param {{
        acctId: ObjectId,
        userId: ObjectId,
        amount: number
        }} withdrawal 
     * @param {number} withdrawableBal
     * @returns {Promise<Withdrawal>}
     */
        withdraw = async (withdrawal /**Withdrawal */, 
        withdrawableBal /**number */) /**Promise<Withdrawal> */ =>{};
}

class WithdrawalService {
    /**
     * @desc Creates a withdrawal if account has the available amount to fund it.
     * sets withdrawal status to pending;
     * @param {{
        acctId: ObjectId,
        userId: ObjectId,
        amount: number
        }} withdrawal 
     * @param {number} withdrawableBal
     * @returns {Promise<Withdrawal>}
     */
    withdraw = async (withdrawal /**Withdrawal */, 
                    withdrawableBal /**number */) /**Promise<Withdrawal> */ => {
        try{
            // get all pending and approved withdrawals
        const pendingOrApprovedWithdrawals /** Array<Withdrawal>*/ = await Withdrawal.where({
            acctId: withdrawal.acctId,
                
        }).where({
            $or: [{status: "pending"}, {status: "approved"}]
        });

        // Get total amount 
        let pendingOrApprovedWithdrawalsAmt /**number */ = 0;
        for(let withdrawal /**Withdrawal */ of pendingOrApprovedWithdrawals)
            pendingOrApprovedWithdrawalsAmt  += withdrawal.amount;
        
        // check available withdrawable balance
        const amtWithdrawable /**number */ = withdrawableBal - pendingOrApprovedWithdrawalsAmt;
        
        const requestedWithdrawal /**number  */ = withdrawal.amount;

        console.log({withdrawableBal, requestedWithdrawal, amtWithdrawable});
        if(requestedWithdrawal < amtWithdrawable){
            const withdrawalModel /**Withdrawal */= new Withdrawal(withdrawal); 
            return await withdrawalModel.save();
        }
        return null;
        } catch(err /**Error */){
            console.log("err =>", err);
            return null;
        }
        
    };
}

module.exports = {WithdrawalService, IWithdrawalService};