// Import Navigation Component
import NavigationBar from "../../components/navigation";
import { UserState } from "../../globalStore/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";

// Custom Hooks
import {useReRouteIfNotSignedIn} from "../../customHooks/auth.hooks.js";

// MdOutlinePendingActions => Approved 
import { MdOutlinePendingActions, MdOutlineApproval, MdSmsFailed } from 'react-icons/md';

import {AiFillMinusSquare, AiFillPlusSquare,  AiOutlineLoading3Quarters} from "react-icons/ai";
import {GrStatusGood} from "react-icons/gr";

import {BiHide} from "react-icons/bi";
//Styling
import "../css/acct.css";
import "../css/general.css";


// Components
import {Loading} from "../../components/loading.js";
/**
 * UserModel: {
    fullName: string;
    email: string;
    token: string;
    _id: string;
}
 */

/**
 * TransactionModel {
      "_id": ObjectId,
      "acctId": ObjectId,
      "amount": number,
      "currency": "dollar",
      "status": "approved",
      "desc": "No description",
      "createdAt": "2022-09-25T16:25:23.491Z",
      "updatedAt": "2022-09-25T16:25:23.491Z",
      "__v": 0
    },
 */

/**
 * InvestmentModel {
    "_id": "6337c4c16fffe65e1e9e9412",
    "amount": 7450,
    "yieldValue": 13000,
    "waitPeriod": 21,
    "currency": "pounds",
    "desc": "Risk is less than 9%",
    "__v": 0,
    "deleted": false
  }
 */
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
            View Transaction History
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            {
                userTransactions.map(transaction /**: TransactionModel */ => 
                    (
                    <section key={transaction._id} className={"transaction"}>
                        <div className="transactionStatus">
                        {transaction.status == "pending" ? 
                            <MdOutlinePendingActions /> : 
                            transaction.status == "approved" ? 
                            < MdOutlineApproval/> : <MdSmsFailed />
                        }
                        </div>
                        <div className="transactionDesc">
                            {transaction.amount > 0 ? <>
                                <AiFillMinusSquare />
                                Debit 
                                {" " + transaction.desc}
                            </> : <>
                                <AiFillPlusSquare />
                                Credit 
                                {" " + transaction.desc}
                            </>} 
                        </div>

                        <div className="transactionDate">
                                {transaction.createdAt.slice(0, 20)}
                        </div>

                        <div className="amount">
                            {transaction.amount} {transaction.currency}
                        </div>
                    </section>

                    
                    )
                )
            }
        </main>
    </div>)
}

const RequestFundAccount = (props) => {
    const hideSuccessRef /**: Reference */ = useRef();
    const [investments /**: Array<InvestmentModel> */, 
        setInvestments /**: funct<T, T> */] = useState([])
    // Get token
    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";

    // Manage Loading Assets
    const [loading /**: bool */, setLoading /**: funct<bool, bool> */] = useState(false);

    // Manage form
    const [transactionForm /**: Object */, setTransactionForm /** funct<T, T> */] = useState({
        desc: "",
        investmentId: ""
    })
    
    useEffect(() => {
        getInvestments();
    }, [])

    // Handles toggle
    const toggleRef = useRef();
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }



    // Get available investments
    async function getInvestments(){
        setLoading(prevVal => true);
        const investmentsReq /*: Request*/ = await fetch(`/investment/retrieve`, {
            method: "GET",
            headers: {
                authorization: token
            }
        })
        if(investmentsReq.ok){
            const investmentsRes /** Array<InvestmentModel> */ = await investmentsReq.json();
            setLoading(prevVal => false);
            setInvestments(prevInvList => investmentsRes);
        }
    }

    const updateTransactionForm = e /*:EventObject */ => {
        setTransactionForm(transaction => ({...transaction,
                             [e.target.name]: e.target.value}));
    }
    const submitTransactionAction = async (e /*:EventObject */) /**: Promise<void> */ => {
        e.preventDefault();
        const transactionDTO /**: Object<str, str>*/ = JSON.stringify(transactionForm);
        setLoading(true);
        const createTransactionReq /*: Request */ = await fetch(`/transaction/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: transactionDTO
        })
        if(createTransactionReq.ok){
            setLoading(false);
            const createTransactionRes /**: TransactionObject */ = await createTransactionReq.json();
            setTransactionForm({
                desc: "",
                investmentId: ""
            })
            // Display success message
            hideSuccessRef.current.classList.remove("hide");
        }
    }
    const hideSuccessMsgAction = e /**: EventObject */ => {
        
        hideSuccessRef.current.classList.add("hide");
    }
    return (<div className="container">
        <h3 className="containerDesc">
            Request to fund Investment
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            {/* Form to fund investment */}
            {
                loading ? (<Loading />) : (
                    
                    <form onSubmit={submitTransactionAction}>
                    <div className="successful" ref={hideSuccessRef}>
                        <GrStatusGood /> 
                        Your request for funding investment was successful
                        <button onClick={hideSuccessMsgAction} type="button"><BiHide /></button>
                    </div>
                    <label htmlFor="investmentId">
                        <p>Select Investment</p>
                        <select 
                            name="investmentId"
                            value={transactionForm.investmentId} 
                            onChange={updateTransactionForm}
                            minLength="2"
                            required={true} >
                            <option value="">
                                --
                            </option>
                            {
                                investments.map(inv => (
                                    <option value={inv._id} key={inv._id}>
                                        Invest {inv.amount} {inv.currency} for a return of {inv.yieldValue}{inv.currency} in {inv.waitPeriod} days
                                    </option>
                                ))
                            }
                            
                        </select>
                    </label>
    
                    <label htmlFor="desc">
                        <p>Add Extra Comment (Optional)</p>
                        <input name="desc"
                        value={transactionForm.desc} 
                        onChange={updateTransactionForm}/>
                    </label>
    
                    <button>Request to fund investment</button>
                </form>
                )
            }
            
        </main>
    </div>)
}

const ViewEarnings = (props) => {
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
 * @route /acct/home
 * @param {*} props 
 * @returns ReactComponent
 */
const UserAccountComponent /*: ReactComponent */ = (props) => {
    // Check if a user is signed in
    useReRouteIfNotSignedIn("/acct/home")
    const User = useRecoilValue(UserState);
    return (<div className="userAcctHomePage">
        <ViewTransactionHistory user={User}/>
        <RequestFundAccount user={User}/>
        <ViewTransactionHistory user={User}/>
        <ViewTransactionHistory user={User}/>
    </div>)
    
}

const UserAccountHomePage /*: React Component */= (props) => {
    return (<>
        <NavigationBar active='UserAccountHomePage'/>
        <UserAccountComponent />
    </>)
}

export default UserAccountHomePage;