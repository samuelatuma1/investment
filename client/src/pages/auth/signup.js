// Styles
import "../css/forms.css";
import SignUpImg from "./static/signup.png";

// Navigation
import {
    Link
} from "react-router-dom";

// Hooks
import {useEffect, useState} from "react";

// Components
import NavigationBar from "../../components/navigation";

// icons
import {TiTick} from "react-icons/ti";
import {MdError} from "react-icons/md";
import {AiFillCheckCircle} from "react-icons/ai";
function searchForEmpties(dict){
    for(let key in dict){
        let val = dict[key].trim();
        if(val.length === 0){
            return false;
        }
    }
    return true;
}
function match(strA, strB){
    return strA === strB;
}

function strongPassword(string){
    const lowerCases = "abcdefghijklmnopqrstuvwxyz";
    const upperCases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const specialChars = "`!\"£$%^&*()_+-~#{}@:;?.,<>'";

    let scores = new Set();
    let required = new Set(["Lower cases", "Upper cases", "Numbers", "Special Characters"])
    for(let char of string){
        if(lowerCases.includes(char)){
            // console.log(required)
            
            required.delete("Lower cases");
            scores.add("Lower cases");
        }
            
        else if(upperCases.includes(char)){

            required.delete("Upper cases");
            scores.add("Upper cases");
        }
        else if(nums.includes(char)){
            required.delete("Numbers");
            scores.add("Numbers");
        }
        else if(specialChars.includes(char)){
            required.delete("Special Characters");
            scores.add("Special Characters");
        }
    }
    if(required.size > 0){
        return {
            passed: false,
            required: Array.from(required)
        };
    }
    return ({ passed: true, required: Array.from(required)});
    
}

const SignUpForm = (props) => {
    const [signupForm, setSignupForm] = useState({
        fullName : "",
        email: "",
        password: "",
        retypePassword: ""
    });
    /** { passed: boolean, required: Array<string> */
    const [strongPass, setStrongPass] = useState(strongPassword(signupForm.password));
    
    const [formErrors, setFormErrors] = useState([])
    const [formSuccess, setFormSuccess] = useState([])
    useEffect(() => {
        setStrongPass(strongPassword(signupForm.password));
    }, [signupForm.password])


    function updateForm(e){
        setSignupForm(prev => ({...prev, [e.target.name]: e.target.value}));
    }
    

    async function submitForm(e){
        e.preventDefault();
        const formDetails = searchForEmpties(signupForm)
        if(!formDetails){
            alert("Please fill out all fields");
            return;
        }
        if(!match(signupForm.password, signupForm.retypePassword)){
            alert("Please, match passwords");
            return
        }
        if(!strongPass.passed){
            alert("Please input a strong password!")
            return
        }
        // Submit form Data
        // Set formSuccess and formError to empty
        setFormSuccess([]);
        setFormErrors([]);
        const signUpReq = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupForm)
        })
        if(signUpReq.ok){
            console.log(signUpReq)
            if(signUpReq.status === 200){
                const formErrs = await signUpReq.json()
                setFormErrors(formErrs.formErrors)
                console.log(formErrs.formErrors)
                return
            }
            // What to do if all goes well
            setFormSuccess([{msg: `Sign up successful. A verification mail has been sent to ${signupForm.email}`}]);
        } else{
            if(signUpReq.status === 400){
                setFormErrors([{"msg": `Email Verification Failed. Please try again`}])
                return 
            } 
            if(signUpReq.status === 403){
                setFormErrors([{"msg": `${signupForm.email} already in use. Please try a different email address.`}])
                return 
            }
        }

    }
    return (
        <div className="auth">
        
        <form className="form" onSubmit={submitForm}>
            
            <div className="desc">
                <h1>Sign up here</h1>
            </div>

            <div className="errors">
                {
                    formErrors.length > 0 ?
                    (
                   
                    formErrors.map((err, key) => (<li className="formErr" key={key}>
                        <MdError />
                        {err.param} {err.msg}
                    </li>)) 
                    
                    ): <></>
                }
            </div>

            <div className="success">
                {
                    formSuccess.length > 0 ? (
                        formSuccess.map((success, key) => (
                            <li className="formSuccess" key={key}>
                                <AiFillCheckCircle />
                                {success.msg}
                            </li>
                        )) 
                    ) : <></>
                }
            </div>

            <div>
                <label htmlFor="fullName">
                    Full Name:
                        <input type="text" name="fullName" value={signupForm.fullName} onChange={updateForm} required={true} />
                </label>

                <label htmlFor="email">
                    Email:
                        <input type="email" name="email" value={signupForm.email} onChange={updateForm} required={true} />
                </label>

                <label htmlFor="password">
                    Password:
                        <input type="password" name="password" value={signupForm.password} onChange={updateForm} required={true} minLength={6}/>

                        
                            {!strongPass.passed ?
                                <>
                                   <p>
                                    Password must contain
                                   </p>
                                   <ul>
                                       
                                        {
                                            strongPass.required.map((string, key) => (
                                                <li key={key}>{string}</li>
                                            ))
                                        }
                                    </ul> 
                                </> :
                                <>Strong password <TiTick /></>
                            }
                        
                </label>

                <label htmlFor="retypePassword">
                    Retype password:
                        <input type="password" name="retypePassword" value={signupForm.retypePassword} onChange={updateForm}  />
                </label>
            </div>
            <button>Sign up</button>
            <p>
                Already have an account?
                <Link to="/auth/signin">
                    Sign in here
                </Link>
            </p>
            
        </form>

        <div className="authImg">
            <img src={SignUpImg} alt="sign up" />
        </div>
    </div>
    );
}
const Signup = props => {
    return (
        <>
            <NavigationBar />
            <SignUpForm />
        </>
    );
}

export default Signup;