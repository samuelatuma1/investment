// Styles
import "../css/forms.css";
import SignInImg from "./static/signin.png"
// Routing
import {Link} from "react-router-dom";
// React Hooks
import {useState, useEffect} from "react";
import  NavigationBar from "../../components/navigation.js";

// Get Global User
import {UserState} from "../../globalStore/atoms.js";
// Import global management tool
import {
    useSetRecoilState
} from "recoil";

// router
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

/**
 * @route /auth/signin?next=string
 * @param {*} props 
 * @returns 
 */
function SignInForm(props){
    const [params] /*: Object ({}) */= useSearchParams();
    const navigate /*: NavigateObject  */ = useNavigate();

    const [signinForm, setSigninForm]  = useState({
        email : "",
        password: ""
    });
    // Global User state
    const setGlobalUser = useSetRecoilState(UserState);

    function updateForm(e){
        setSigninForm(prevData => ({...prevData, [e.target.name]: e.target.value}))        
    }
    async function signupUser(e){
        e.preventDefault();
        // Verify email and password is present
        if(!signinForm.email.trim() || !signinForm.password.trim()){
            alert("Please, input email and password");
            return
        }
        const signInReq  = await fetch("/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signinForm)
        });
        if(signInReq.ok){
            // Get data 
            const signInRes = await signInReq.json()
            alert(JSON.stringify(signInRes))
            setGlobalUser(prevUser => signInRes);

            // If a next parameter is provided, navigate to next(default /acct/home)
            // const navigateTo = params.next || "/acct/home";
            const navigateTo = params.get("next")|| "/acct/home";
            navigate(navigateTo);
        } else{
            alert("There was an error verifying user. Please try again.")
        }
    }
    return (<div className="auth">
        <form className="form" onSubmit={signupUser}>
            <div>
                
                <label htmlFor="email">
                    Email: 
                    <input type="email" required={true} name="email" value={signinForm.email} 
                    minLength={1}
                    onChange={updateForm}
                    />
                </label>

                <label htmlFor="password">
                    Password: 
                    <input type="password" required={true} minLength={5}
                    name="password"
                    value={signinForm.password} onChange={updateForm}
                    />
                </label>

            </div>

            <button type="submit">Sign in</button>
            <p>
                Don't have an account?
                <Link to="/auth/signup">
                    sign up here
                </Link>
        
            </p>
        </form>

        <div className="authImg">
            <img src={SignInImg} alt="sign in" />
        </div>
    </div>)
}


const Signin = props => {
    return (
        <>
            <NavigationBar active='signin'/>
            <SignInForm />
        </>
    );
}

export default Signin;
