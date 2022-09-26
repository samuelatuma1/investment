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

import {AiFillMinusSquare, AiFillPlusSquare} from "react-icons/ai";

//Styling
import "../css/acct.css";

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
        <ViewTransactionHistory user={User}/>
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