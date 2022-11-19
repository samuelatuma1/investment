// Imports
// states
import { useState, useEffect } from "react";
import homePageBackgroundIntroImg from "../../static/home/intro/imageforbg.webp";
import NavigationBar from "../../components/navigation";
import { Loading } from "../../components/loading";

// Navigation
import {Link} from "react-router-dom";

// icons
import {FaUserAlt} from "react-icons/fa";
import {BsFillChatLeftTextFill} from "react-icons/bs"
// style
import "../css/home.css";
// Styles
const homePageBgImg /** {[Key: String]: string} */ = {
    // backgroundImage: `url(${homePageBackgroundIntroImg})`,
    backgroundSize: "contain",
    minHeight: "350px"

}
const HomePageIntro = (props /** {[key: string]: any} */) /**Component */ => {
    // Get Intro details
    // variables
    const signUpUrl = "/auth/signup"
    const whatsappURLBase /** URL */= "https://wa.me/";
    // States
    const [intro /**{[key: string]: string} */, setIntro /**Funct<T, T> */] = useState({
            heading: "Visual Studio 2022 for Mac Blog Posts",
            body: "The Visual Studio Blog is the official source of product insight from the Visual Studio Engineering Team. You can find in-depth information about the Visual Studio 2022 for Mac releases in the following posts:",
            imgUrl: "",
            adminWhatsappNum: ""
    })
    const [loading, setLoading] = useState(false);

    // Effects
    useEffect(() => {
        fetchIntro();
    }, [])
    const fetchIntro = async () /**void */ => {
        setLoading(true);
        const introReq /**Request */ = await fetch("/home/intro");
        if(introReq.ok){
            setLoading(false);
            const introRes /**Intro */ = await introReq.json();
            setIntro(prevIntro => introRes.intro);
        }
    }
    return (
    <>
        <div className="homePageIntroDiv" style={homePageBgImg}>
            {
                loading ? <Loading /> : 
                <section>
                    <div className="introTextDiv">
                        <h1>{intro?.heading}</h1>

                        <main>
                            
                            <p>
                            {intro?.body}
                            </p>
                            
                            <div className="authBtns">
                                <button className="authBtnSignUp">
                                    <Link to={signUpUrl}>
                                        <FaUserAlt /> Sign up with Email
                                    </Link>
                                </button>

                                <button className="authBtnSignUp">
                                    <a href={`${whatsappURLBase}${intro?.adminWhatsappNum}`}>
                                        <BsFillChatLeftTextFill /> Chat with Representative
                                    </a>
                                </button>
                            </div>
                        </main>


                    </div>

                    <div className="introImgDiv">
                        {
                            intro.imgUrl ? 
                            <img 
                            crossOrigin="anonymous" 
                            src={intro.imgUrl}/>: <div></div>
                        }
                    </div>


                </section>
            }
        </div>
    </>)
}

const HomePage /**Component */ = (props) => {
    return (
    <div>
        <NavigationBar active='' />
        <HomePageIntro />
    </div>)
}

export {HomePage};