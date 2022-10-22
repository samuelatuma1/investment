// Import Navigation Component
import NavigationBar from "../../components/navigation";
import { UserState } from "../../globalStore/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import {useNavigate} from "react-router-dom";

// Custom Hooks
import {useReRouteIfNotSignedIn, useReRouteIfNotAdmin} from "../../customHooks/auth.hooks.js";

// MdOutlinePendingActions => Approved 
import { MdEmail, MdDescription } from 'react-icons/md';

// Loading State
import {Loading} from "../../components/loading.js";

import {BsCashCoin, BsFillCalendarRangeFill} from "react-icons/bs"
import {BiHide, BiTimeFive } from "react-icons/bi";
import {GiMoneyStack} from "react-icons/gi";
import {AiFillMinusSquare, AiOutlineTransaction, AiOutlineUser} from "react-icons/ai";

//Styling
import "../css/admin.css";

/**
 * UserModel: {
    fullName: string;
    email: string;
    token: string;
    _id: string;
}
 */

/**
 * InvestmentModel  {
    "_id": "6337c4c16fffe65e1e9e9412",
    "amount": 8000,
    "yieldValue": 12198,
    "waitPeriod": 7,
    "currency": "dollars",
    "desc": "",
    "__v": 0,
    "deleted": false
  }
 */




const investmentHeaders = (<div className="investment">
        <h4>Minimum Amount <BsCashCoin /></h4>
        <h4>% ROI <GiMoneyStack /></h4>
        <h4>Wait Period (Days) <BsFillCalendarRangeFill /></h4>
        {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
        <h4>Name <MdDescription /></h4>
        <h4>Update</h4>
    </div>)

const investmentFormHeaders = (<div className="investment">
        <h4>Minimum Amount <BsCashCoin /></h4>
        <h4>% ROI <GiMoneyStack /></h4>
        <h4>Wait Period (Days) <BsFillCalendarRangeFill /></h4>
        {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
        <h4>Name <MdDescription /></h4>
        <h4>Curency</h4>
    </div>)


const CreateInvestment /**: ReactComponent */ = props => {
    
    const token /**: JWTToken */ = props.token
    const updateInvestmentFormRef = useRef(null);
    
    const [investments /**: List<Investment> */, setInvestments /**: Funct<List<Investment>, T> */] = props.investmentsState;

    const [updateInvestment, setUpdateInvestment] = useState({
        amount: 0,
        yieldValue:0,
        waitPeriod: 0,
        desc: "No description",
        currency: "currency"
    });

    /**
     * @desc Updates updateInvestment state
     */
     const updateInvestmentAction = (e) => {
       
        setUpdateInvestment(prevInvestment => ({...prevInvestment, 
                        [e.target.name]: e.target.value}));
        
    }
    const submitCreateInvestmentForm =async e => {
        e.preventDefault();
        const createInvestmentReq /**: Request */ = await fetch(`investment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(updateInvestment)
        })

        if(createInvestmentReq.ok){
            const createdInvestment /*: InvestmentModel */ = await createInvestmentReq.json();
            setInvestments(prevInv => {
                const addInvestment /*: Array<InvestmentModel> */ = prevInv.slice(0);
                addInvestment.push(createdInvestment);
                return addInvestment;
            })
            alert("Successfully created");
        } else{
            alert("Error creating Investment.Please try again")
        }
    }
    return (<div>
        {/* 
            * @desc manages creation of investment when an 
          */}
        <form className="updateInvestment" onSubmit={submitCreateInvestmentForm} >
            <h3 style={{textAlign: "center", padding: "10px"}}>Create Investment <button type="button" onClick={(e) => {
                e.preventDefault()
                updateInvestmentFormRef.current.classList.toggle("hide")}}>Hide</button></h3>
            
            <section ref={updateInvestmentFormRef}>
            {investmentFormHeaders}
            <div className="investment">
                <input type="number" min="1" 
                    required={true} value={updateInvestment.amount}
                    name="amount"
                    placeholder="Investment amount"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="1" 
                    required={true} value={updateInvestment.yieldValue}
                    name="yieldValue" placeholder="Return on Investment (%)"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.waitPeriod}
                    name="waitPeriod" placeholder="Wait Period"
                    onChange={updateInvestmentAction}
                />
                {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
                <textarea type="string"
                    value={updateInvestment.desc}
                    name="desc" placeholder="description of the investment"
                    onChange={updateInvestmentAction}
                />

                <input type="string"
                    value={updateInvestment.currency}
                    name="currency"
                    onChange={updateInvestmentAction}
                />
            </div>
            <div className="investmentActions">
                <button type="submit">Create Investment</button>
            </div>
            </section>
            
        </form>
    </div>)
}

/**
 * 
 * @param {{user: UserState}} props 
 * @returns component for managing Investment
 */
const RetrieveAndUpdateInvestments /**: ReactComponent */= (props) => {
    const [investments /*: Array<investmentModel> */, 
            setInvestments /*: funct<Array<T>, Array<T>>  */] = useState([]);
    const [updateInvestment, setUpdateInvestment] = useState({
                amount: 0,
                yieldValue:0,
                waitPeriod: 0,
                desc: "No description",
                currency: "currency"
            });
    const updateInvestmentFormRef = useRef(null);
    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";
    async function getAllInvestments() {
        const retrieveInvestmentReq /*: Request */ =  await fetch("/investment/retrieve");
        if(retrieveInvestmentReq.ok){
            const investments /*: List<InvestmentModel> */ = await retrieveInvestmentReq.json();
            setInvestments(prevInvestments /**: List<InvestmentModel> */ => investments);
        } else{
            alert("An error occured retrieving investments");
        }
    }
    
    useEffect(() => {
        getAllInvestments()
      
    }, [])

    function displayInvestmentAction(e){
        // get investmentId
        const _id /**: ObjectId */ = e.target.id;
        
        // Find investment with matching id
        const investment /*:InvestmentModel*/ =  investments.find(investment /**:InvestmentModel */ => 
            investment._id === _id            
        );
        if(investment != null){
            setUpdateInvestment(prevInvestment => investment)
            updateInvestmentFormRef.current.classList.remove("hide");
        } else {
            alert("Something went wrong, please try again")
        }
    }

    /**
     * @desc Updates updateInvestment state
     */
     const updateInvestmentAction = (e) => {
       
        setUpdateInvestment(prevInvestment => ({...prevInvestment, 
                        [e.target.name]: e.target.value}));
        
    }
    /**
     * 
     * @param {Array<InvestmentModel>} investments
     * @param {ObjectId} id
     * @param {InvestmentModel} newPayload 
     * @returns {Array<InvestmentModel>}
     */
    function findByIdAndUpdate(investments /*: Array<InvestmentModel>*/,id /**: ObjectId */, newPayload /*: InvestmentModel  */){
        const investmentsCopy /**: Array<InvestmentModel> */ = investments.slice(0);
        let found /**: boolean */ = false;
        let idxOfFound /*: number */= -1;
        for(let idx /**number */ = 0; idx < investments.length; idx++){
            const investment /*: InvestmentModel */ = investments[idx];
            if(investment._id === id){
                found = true;
                idxOfFound = idx;
                break;
            }
        }
        if(found){
            investmentsCopy[idxOfFound] = newPayload;
        }
        return investmentsCopy;
    }
    /**
     * 
     * @param {Event} e 
     * submits updated form to the back end
     */
    async function submitUpdateInvestmentForm(e){
        e.preventDefault();
        const saveUpdateReq = await fetch(`/investment/update/${updateInvestment._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
            body: JSON.stringify(updateInvestment)
        })
        if(saveUpdateReq.ok){
            await saveUpdateReq.json();
            setInvestments(prevInvestments =>findByIdAndUpdate(prevInvestments, 
                        updateInvestment._id, updateInvestment) );
            alert("Investment successfully updated");
        } else{
            alert("An error occured and updates could not be made")
        }
    }

    /**
     * 
     * @param {Array<InvestmentModel>} investments 
     * @param {ObjectId} id 
     * @returns {Array<InvestmentModel>} with investment with id removed
     */
    function findByIdAndDelete(investments /*: Array<InvestmentModel>*/,id /**: ObjectId */)/*: Array<InvestmentModel>*/{
        return investments.filter(investment => investment._id !== id);
    }

    async function deleteInvestmentAction(e){
        const deleteInvestmentReq /*: Request*/ = await fetch(`/investment/delete/${updateInvestment._id}`, {
            method: "DELETE"
        })
        if(deleteInvestmentReq.ok){
            setInvestments(prevInv => findByIdAndDelete(prevInv, updateInvestment._id));
            alert("successfully deleted investment");
        } else{
            alert("Failed to delete investment");
        }
    }
    return (<div className="investments">
        
        <CreateInvestment token={token} investmentsState={[investments, setInvestments]}/>
        {/* 
            * @desc manages update of investment when an investment is clicked
          */}
        <form className="updateInvestment hide" onSubmit={submitUpdateInvestmentForm} ref={updateInvestmentFormRef}>
            <h3 style={{textAlign: "center", padding: "10px"}}>Update Investment <button type="button" onClick={(e) => {
                e.preventDefault()
                updateInvestmentFormRef.current.classList.add("hide")}}>Hide</button></h3>
            {investmentFormHeaders}
            <div className="investment">
                <input type="number" min="0" 
                    required={true} value={updateInvestment.amount}
                    name="amount"
                    placeholder="Investment amount"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.yieldValue}
                    name="yieldValue" placeholder="Return on Investment"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.waitPeriod}
                    name="waitPeriod" placeholder="Wait Period"
                    onChange={updateInvestmentAction}
                />
                {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
                <textarea type="string"
                    value={updateInvestment.desc}
                    name="desc" placeholder="description of the investment"
                    onChange={updateInvestmentAction}
                />

                <input type="string"
                    value={updateInvestment.currency}
                    name="currency"
                    onChange={updateInvestmentAction}
                />
            </div>
            <div className="investmentActions">
                <button type="submit">Update Investment</button>
                <button type="button" id="delete" onClick={deleteInvestmentAction}>Delete Investment</button>
            </div>
        </form>




       <section>
        {investmentHeaders}
       {
         investments.map(investment /*: InvestmentModel */ => (
            <section className="investment" key={investment._id}>
                <div>{investment.amount} {investment.currency}</div>
                <div>{investment.yieldValue}%</div>
                <div>{investment.waitPeriod}</div>
               
                <div>{investment.desc || "No description"}</div>
                <div><button id={investment._id} onClick={displayInvestmentAction} className="activeInvestment">Update</button></div>
            </section>
         ))
       }
       </section>
    </div>)
}
/**
 * @Component
 * @param {*} props 
 * @returns JSX
 */
const ViewTransactionHistory = (props) => {
    const toggleRef = useRef();
    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";

    const [userTransactions, setUserTransactions] = useState([]);

    useEffect(() => {
        getTransactions()
    }, [])

    function toggleRefDisplay(){
        toggleRef.current.classList.toggle("hide");
    }
    // Get transactions
    async function getTransactions(){
        const userAcctTransactionsReq /**: Request */ = await fetch(`/transaction/gettransactions`, {
            headers: {
                authorization: token
            }
        })

        if(userAcctTransactionsReq.ok){
            const userAcctTransactionsRes /**: List<TransactionModel> */ = await userAcctTransactionsReq.json();
            setUserTransactions(prevTransactions => userAcctTransactionsRes.acctTransactions);
            // alert(JSON.stringify(userAcctTransactionsRes));
        }
    }
    return (
    <div className="container">
        <h3 className="containerDesc">
            Manage Investments
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            <RetrieveAndUpdateInvestments />
        </main>
    </div>)
}

/**
 * @desc React Component for updating transactions
 * @param {} props 
 */
const PendingTransactionDisplay /**:ReactComponent */ = (props) => {
    const transactionContent /**Ref */ = useRef(null);
     
    const token /**:String */ = props.token;
    
    const transaction /**: TransactionModel(Populated) */ = props.transaction;

    const hideEventResponse /**Ref */ = useRef(null);
    // Keep track of current transaction and mail
    const [currTransactionId /**ObjectId */, setCurrTransactionId /**Funct<T, T> */] = useState(transaction._id);
    const [currTransaction /**Object<string, string> */, setCurrTransaction /**Funct<T, T> */] = useState({
        status: transaction.status
    })
    const [currMail /**: Object<string, string> */, setCurrMail /**Funct<T, T> */] = useState({
        to: transaction.user.email,
        subject: `Status on ${transaction.investmentId.desc}`,
        html: ""
    });

    /**
     * @desc updates email body whenever transaction status is modified
     */
    function updateEmailText() /**void */{
        setCurrMail(prevMail => ({
            ...prevMail, html: `Dear ${transaction.user.fullName}, your status on the investment ${transaction.investmentId.desc}, with investment amount of ${transaction.amount}${transaction.currency} has been updated to ${currTransaction.status}`
        }));
    }
    useEffect(() => {
        updateEmailText()
    }, [currTransaction])

    const transactionContentDisplayAction /**Consumer<Event> */ = (e /**Event */) /**Void */ => {
        transactionContent.current.classList.toggle("hide");
    }

    function updateStatusAction(e /**EventObject */) /**void */{
        setCurrTransaction(prevStatus => ({...prevStatus, [e.target.name]: e.target.value}));
    }
    function updateMailAction(e /**EventObject */) /**void */{
        setCurrMail(prevVal => ({...prevVal, [e.target.name]: e.target.value}))
    }

    function hideResponseAction(e /**EventObject */) /*void*/{
        hideEventResponse.current.classList.add("hide");
    }
    function showResponseAction(){
        hideEventResponse.current.classList.remove("hide");
    }

    async function updateStatusAndSendMailAction(e /**EventObject */) /**void */{
        e.preventDefault();
        // Merge mail and status states
        const transactionAndMailBody /** Object<string, Object<string, string> */ = {
            transaction: currTransaction,
            mail: currMail
        };
        const transactionId /**ObjectId*/ = currTransactionId;

        // send Request
        const requestUrl /**String */ = `/transaction/update/${transactionId}`;
        const updateTransactionSendMailRequest /**Request */= await fetch(requestUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(transactionAndMailBody)
        })

        if(updateTransactionSendMailRequest.ok){
            const updateTransactionSendMailResponse /**Response */ = await updateTransactionSendMailRequest.json();
            if(updateTransactionSendMailResponse.updated){
                showResponseAction();
            }
        }

    }

    
    return (
        <div className="adminTransactionUpdateDiv">
            <h3 style={{display: "flex", justifyContent: "space-between"}}>
                <span>
                    {transaction.amount}{transaction.currency} {" "}
                    {transaction.investmentId.desc} by {" "}
                    {transaction.user.fullName}
                </span>
                 <button 
                 className="showBtn"
                 onClick={transactionContentDisplayAction}
                 >Update</button>
            </h3>
            <div ref={transactionContent} className="hide transactionContent">
                    
                <div>
                    
                    <section>
                        <h4>Transaction Name <AiOutlineTransaction /></h4>
                        <p>{transaction.investmentId.desc}</p>
                    </section>
                    <section>
                        <h4>Amount Invested <BsCashCoin /></h4>
                        <p>{transaction.amount}{transaction.currency}</p>
                    </section>


                    <section>
                        <h4>Investor <AiOutlineUser /></h4>
                        <p>
                            {transaction.user.fullName}
                        </p>
                    </section>
                    <section>
                        <h4>Investor Email <MdEmail /></h4>
                        <p>
                            {transaction.user.email}
                        </p>
                    </section>


                    <section>
                        <h4>Transaction Status</h4>
                        <p>
                            {transaction.status}
                        </p>
                    </section>
                    <section>
                        <h4>Transaction Date <BiTimeFive /></h4>
                        <p>
                            {transaction.updatedAt}
                        </p>
                    </section>
                </div>

                <form className="updateStatus" onSubmit={updateStatusAndSendMailAction}>
                    <h4>Update Status</h4>
                    <select value={currTransaction.status}
                    name="status"
                    onChange={updateStatusAction}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div>
                        <h4>Accompanying Mail</h4>
                        <main>
                            <label htmlFor="subject">
                                <p>Subject: *</p>
                                <input id="subject"
                                name="subject"
                                value={currMail.subject}
                                required={true}
                                minLength={5}
                                onChange={updateMailAction}
                                />
                            </label>

                            <label htmlFor="subject">
                                <p>Email Body: *</p>
                                <textarea id="html"
                                name="html"
                                value={currMail.html}
                                required={true}
                                minLength={5}
                                onChange={updateMailAction}
                                />
                            </label>
                        </main>
                    </div>
                    <p className="hide" ref={hideEventResponse} >
                        Status successfully updated and email sent successfully
                        <button type="button" onClick={hideResponseAction}><BiHide /></button>
                    </p>
                    <button className={"goldBtn"}>
                        Update Status and Send Mail
                    </button>
                    
                </form>
            </div>
        </div>
    );

}



const UpdatePendingTransactions = (props) => {
    const [loading, setLoading] = useState(false);

    const [pendingTransactions, setPendingTransactions] = useState([]);
    const toggleRef = useRef();

   const [transactionsStatus, setTransactionsStatus] = useState("pending");

    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    useEffect(() => {
        getPendingTransactions();
    }, [])
    // Get Pending transactions
    async function getPendingTransactions(status /** enum {pending, approved, rejected}*/ = "pending") /**void */{
        setLoading(true);
        const transactionsReq /**: Request */ = await fetch(`/transaction/filtertransactions?status=${status}`, {
            headers: {
                authorization: token
            }
        });
        if(transactionsReq.ok){
            setLoading(false);
            const transactionsRes /**: List<TransactionModel> */ = await transactionsReq.json();
            setPendingTransactions(transactions => transactionsRes);
        }
    }

    function getTransactionsWithStatus(e /**EventObject */) /**void */{
        // get currentstatus of button
        const selectedStatus /*string*/ = e.target.id;
        getPendingTransactions(selectedStatus);
        setTransactionsStatus(selectedStatus);

    }
    return (<div className="container">
        <h3 className="containerDesc">
            Update Transactions 
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>
        {
            loading ? <Loading /> : (
                <main className="toggleRef" ref={toggleRef}>
                    <section className="statuses">
                        <button id="pending" 
                        onClick={getTransactionsWithStatus}>
                            Pending
                        </button>
                        <button id="approved"
                        onClick={getTransactionsWithStatus}>
                            Approved
                        </button>
                        <button id="rejected"
                        onClick={getTransactionsWithStatus}>
                            Rejected
                        </button>
                    </section>
                    <header>
                        <h3>
                        {transactionsStatus} Transactions
                        </h3>
                    </header>
                    <div className="transactionsContainer">
                        {
                            pendingTransactions.map(transaction => (
                                <div key={transaction._id}>
                                   <PendingTransactionDisplay 
                                   transaction={transaction}
                                   token={token}
                                   />
                                </div>
                            ))
                        }
                    </div>
                </main>
            )
        }
    </div>)
}

const RequestFundAccount = (props) => {
    const toggleRef = useRef();

    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    
    return (<div className="container">
        <h3 className="containerDesc">
            View Transaction History
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            Hello, world
        </main>
    </div>)
}


const RequestWithdrawal = (props) => {
    const toggleRef = useRef();

    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    return (<div className="container">
        <h3 className="containerDesc">
            View Transaction History
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            Hello, world
        </main>
    </div>)
}

/**
 * @route /admin
 * @param {*} props 
 * @returns ReactComponent
 */
const UserAdminComponent /*: ReactComponent */ = (props) => {
    // Check if a user is admin
    useReRouteIfNotAdmin("/admin")
    const User = useRecoilValue(UserState);
    return (<div className="userAcctHomePage">
        <ViewTransactionHistory user={User}/>
        <UpdatePendingTransactions user={User}/>
        <RequestWithdrawal user={User}/>
        <RequestWithdrawal user={User}/>
       
    </div>)
    
}


const AdminHomePage /*: React Component */= (props) => {
    return (<>
        <NavigationBar active='UserAccountHomePage'/>
        <UserAdminComponent />
    </>)
}

export default AdminHomePage;