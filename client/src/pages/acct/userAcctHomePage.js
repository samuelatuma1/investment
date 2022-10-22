// Import Navigation Component
import NavigationBar from "../../components/navigation";
import { UserState } from "../../globalStore/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";

// Custom Hooks
import {useReRouteIfNotSignedIn} from "../../customHooks/auth.hooks.js";

// MdOutlinePendingActions => Approved 
import { MdNoteAdd} from 'react-icons/md';

import {AiFillMinusSquare, AiFillPlusSquare,  AiOutlineLoading3Quarters, AiOutlineInfoCircle} from "react-icons/ai";

import {FiArrowUp} from "react-icons/fi";
import {GrStatusGood, GrDocumentNotes} from "react-icons/gr";
import {BsBarChartFill, BsCashCoin} from "react-icons/bs";
import {FcLineChart, FcComboChart} from "react-icons/fc";
import {BiHide} from "react-icons/bi";
import {AiOutlineUser} from "react-icons/ai";
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


    // States
    const [userTransactions, setUserTransactions] = useState([]);
    const [currStatus /**string */, setCurrStatus /**Funct<T, T> */] = useState("");
    const [currStatusTransactions /**Array<TransactionModel> */, setCurrStatusTransactions /** Funct<T, T> */] = useState([]);


    // Effects 
    useEffect(() => {
        getTransactions()
    }, [])

    useEffect(() => {
        updateCurrTransactions() 
    }, [currStatus])

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

    function updateCurrTransactions() /**void */{
        setCurrStatusTransactions(currTransactions => {
            return userTransactions.filter(transaction => 
                transaction.status.toLowerCase() === currStatus.toLowerCase()
             );
        })
    }
    function toggleRefDisplay(){
        toggleRef.current.classList.toggle("hide");
    }
    
    // Events
    function updateTransactionsStatus(e /**EventObject */) /**void */{
        // get status to update to
        const status /**string*/ = e.target.id;
        setCurrStatus(prev => status);
    }

    return (
    <div className="container">
        <h3 className="containerDesc">
            View Transaction History
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        <main className="toggleRef" ref={toggleRef}>
            <section className="statusBtns">
                <button id="pending" onClick={updateTransactionsStatus}>Pending <GrStatusGood /></button>
                <button id="approved" onClick={updateTransactionsStatus}>Approved</button>
                <button id="rejected" onClick={updateTransactionsStatus}>Rejected</button>
            </section>
            {
                currStatusTransactions.length > 0 ? currStatusTransactions.map(transaction /**: TransactionModel */ => 
   
                    (
                        <div className="userTransaction" key={transaction._id}>
                            <section>
                                <p>ACCOUNT HOLDER <AiOutlineUser /></p>
                                <h4>{User.fullName}</h4>
                            </section>
                            <section>
                                <p>TRANSACTION ID</p>
                                <h4>{transaction._id}</h4>
                            </section>

                            <section>
                                <p>STATUS <GrStatusGood /></p>
                                <h4>{transaction.status}</h4>
                            </section>
                            <section>
                                <p>AMOUNT INVESTED <BsCashCoin /></p>
                                <h4>{transaction.amount.toLocaleString('en-US')}{transaction.currency}</h4>
                            </section>

                            <section>
                                <p>CURRENT VALUE <FcLineChart /></p>
                                <h4 style={{color: "teal"}}>
                                    {transaction.currentValue.toLocaleString('en-US')}{transaction.currency}
                                </h4>
                            </section>
                        </div>
                    )
                ):
                currStatus === "" ? <></>:
                (<div className="emptyList">
                    <h1><MdNoteAdd /></h1>
                    <p>You have no {currStatus} transactions yet</p>
                </div>)

            }
        </main>
    </div>)
}

/**
 * 
 * @param {*} props 
 */
const AvailableInvestments = props => {
    const User /*: UserModel */= props.user || {};
    const [investments /**: Array<InvestmentModel> */, 
        setInvestments /**: funct<T, T> */] = props.investmentsState;
    const [hideForm /**: Boolean */, setHideForm /**: Funct<T, T> */] = props.hideFormState;
    const [investment /**InvestmentModel */, setInvestment/**Funct<T, T> */] = props.investmentState;

    function toggleFormDisplay(e /**: Event */) /*: void*/{
        const currInvestmentId /**: ObjectId */ = e.target.id;
        const currInvestment /**InvestmentModel */ = findInvestmentById(investments, currInvestmentId);
        setInvestment(prevInv => currInvestment);
        setHideForm(prevState => false);
    }

    /**
     * 
     * @param {InvestmentModel[]} investments 
     * @param {ObjectId} _id 
     * @returns 
     */
    function findInvestmentById(investments/**: InvestmentModel[] */, _id /**: ObjectId */) /**InvestmentModel */{
        const investment /**InvestmentModel */ = investments.find(investment => 
            investment._id === _id);
        return investment;
    }

    return (<div>
        <div className="investmentOptions">
            {
                investments.map(investment => (
                    <div key={investment._id}>
                        <h4>{investment.desc}   <AiOutlineInfoCircle /></h4>
                        <br/>
                        <main>
                            <section>
                                <p>Minimum Investment</p>
                                <h2>{investment.amount.toLocaleString('en-US')}
                                {investment.currency}</h2>
                            </section>
                            <br/>
                            <section>
                                <p>ROI 
                                    <FiArrowUp />
                                    <BsBarChartFill />
                                    </p>
                                <h2>{investment.yieldValue}
                                %</h2>
                                <button
                                onClick={toggleFormDisplay}
                                id={investment._id}>Invest
                                </button>
                            </section>
                        </main>
                    </div>
                ))
            }
        </div>        

    </div>)
}


const RequestFundAccount = (props) => {
    const hideSuccessRef /**: Reference */ = useRef();
    const [investments /**: Array<InvestmentModel> */, 
        setInvestments /**: funct<T, T> */] = useState([])
     
    // Get token
    const User /*: UserModel */= props.user || {};
    const [hideForm /**: Boolean */, setHideForm /**: Funct<T, T> */] = useState(true);
    const token  /* JWTToken */= "Bearer " + User.token || "";

    // Constants
    const PERCENT /**: number  */ = 100;

    // Manage Loading Assets
    const [loading /**: bool */, setLoading /**: funct<bool, bool> */] = useState(false);

    // Manage form
    const [transactionForm /**: Object */, setTransactionForm /** funct<T, T> */] = useState({
        desc: "",
        investmentId: "",
        amount: 0
    })

    const [investment /**InvestmentModel */, setInvestment/**Funct<T, T> */] = useState({
        amount: 0,
        yieldValue: 0,
        waitPeriod: 0,
        desc: "",
        _id: "",
        investmentId: ""
    })

    
    
    useEffect(() => {
        getInvestments();
    }, [])
    // Update transactionFormInvestmentId when investment changes;
    useEffect(() => {
        setTransactionInvestmentId();
    }, [investment])

    /**
     * 
     * @returns {number}Computed transaction amount for investment
     */
    const computeValue = ()/**: number */ => {
        const transactionAmt /**number */ = parseFloat(transactionForm.amount);
        const transactionYield /**number */ = parseFloat(transactionForm.amount * investment.yieldValue / PERCENT);
        const transactionValue /**: number*/ =  transactionAmt + transactionYield; 
                

        return transactionValue ? +transactionValue.toFixed(2) : 0;
        }
    // Handles toggle
    const toggleRef = useRef();
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }


    // set Transaction InvestmentId
    function setTransactionInvestmentId() /**: Void */{
        setTransactionForm(prevForm => ({...prevForm, 
                    investmentId: investment._id}))
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
            // hide investment form
            setHideForm(prevState => true);
        }
    }
    const hideSuccessMsgAction = e /**: EventObject */ => {
        
        hideSuccessRef.current.classList.add("hide");
    }
    return (<div className="container requestInvestment">
        <h3 className="containerDesc">
            Request to fund Investment
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        

        <main className="toggleRef" ref={toggleRef}>
            {/* Form to fund investment */}
            {
                loading ? (<Loading />) : (
                    
                    <div>
                        <h3>Available Investments</h3>
                        <div className="successful hide" ref={hideSuccessRef}>
                            <GrStatusGood /> 
                            Your request for funding investment was successful
                            <button onClick={hideSuccessMsgAction} type="button"><BiHide /></button>
                        </div>
                        <form onSubmit={submitTransactionAction}className={ hideForm ? "hide": ""}>
                        
                        
                        <div className="investmentOptions focus">
                                <div key={investment._id} className="investmentOptionForm">
                                    <h4>{investment.desc}           <AiOutlineInfoCircle /></h4>
                                    <br/>
                                    <main>
                                        <section>
                                            <p>Minimum Investment</p>
                                            <h2>{investment.amount.toLocaleString('en-US')}
                                            {investment.currency}</h2>
                                        </section>
                                        <br/>
                                        <section>
                                            <p>ROI 
                                                <FiArrowUp />
                                                <BsBarChartFill />
                                                </p>
                                            <h2>{investment.yieldValue}
                                            %</h2>
                                        </section>
                                        <br />
                                        <section>
                                            <h2>
                                                Return value <FcComboChart />
                                            </h2>
                                            <main className="projection">
                                                <h2> 
                                                    {computeValue().toLocaleString('en-US')}{investment.currency }

                                                </h2>
                                                <p>
                                                    for 
                                                     {" " + (transactionForm.amount.toLocaleString('en-US'))}{investment.currency + " "}in 
                                                    {" " + investment.waitPeriod} days
                                                </p>
                                            </main>

                                        </section>
                                        <br />
                                        {/* Form Data */}
                                        <section>
                                            
                                            <label htmlFor="amount">
                                                <p>Amount</p>
                                                <input name="amount"
                                                value={transactionForm.amount}
                                                required={true}
                                                type="number"
                                                min={investment.amount}
                                                onChange={updateTransactionForm}
                                                />
                                            </label>

                                            <label htmlFor="desc">
                                            <p>Add Extra Comment (Optional)</p>
                                            <input name="desc"
                                            value={transactionForm.desc} 
                                            onChange={updateTransactionForm}/>
                                        </label>
                        
                                        <button>Request to fund investment</button>
                                        </section>
                                    </main>
                                </div>
                        </div>
        
                        
                        </form>
                        <AvailableInvestments 
                            user={User} 
                            investmentsState={[investments, setInvestments]} 
                            hideFormState={[hideForm, setHideForm]}
                            investmentState={[investment, setInvestment]}

                            />
                        
                    </div>
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