// Imports
// states
import { useState, useEffect } from "react";
import homePageBackgroundIntroImg from "../../static/home/intro/imageforbg.webp";
import NavigationBar from "../../components/navigation";
import { Loading } from "../../components/loading";
import {HiCurrencyDollar} from "react-icons/hi";
import {FaArrowUp} from "react-icons/fa";
import {GrNext, GrLineChart} from "react-icons/gr"
import {TiChartLine} from "react-icons/ti";
import {BsFillCalendar2CheckFill} from "react-icons/bs";
// Navigation
import {Link} from "react-router-dom";
import imgBg from "../../static/home/img.svg";

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

    const [stats /**Array<{data: String, desc: String}> */, setStats /**Funct<T, T> */] = useState([]);
    const [loading, setLoading] = useState(false);

    const flattenStats = (stats /**{[key: string]: {data: String, desc: String}} */) /** Array<{data: String, desc: String}>*/ => {
        const flattenedStats /**Array<{data: String, desc: String}> */ = [];
        for(let statKey /**String */ in stats){
            const statVal /**{data: String, desc: String} */ = stats[statKey];
            flattenedStats.push(statVal);
        }
        return flattenedStats;
    }
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
            const statsValues /**Array<{data: String, desc: String}> */ = flattenStats(introRes.stats);
            setStats(statsValues);
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
                                <Link to={signUpUrl}>
                                    <button className="authBtnSignUp">
                                            <FaUserAlt /> Sign up with Email
                                    </button>
                                </Link>

                                <a href={`${whatsappURLBase}${intro?.adminWhatsappNum}`}>
                                    <button className="authBtnSignUp">
                                        
                                            <BsFillChatLeftTextFill /> Chat with Representative
                                        
                                    </button>
                                </a>
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
            <section className="statsDiv">
                        {
                            stats.map(stat => (
                                <section>
                                    <h3>{stat.data}</h3>
                                    <p>{stat.desc}</p>
                                </section>
                            ))
                        }
            </section>
        </div>
    </>)
}
const coinsDTO = {
    "id": String,
    "symbol": String,
    "current_price": Number,
    "market_cap_change_percentage_24h": Number,
    "image": String,
    "name": String,
    "_id": String
  }
const CoinsRate /**Component */ = (props /** {[key: string]: any} */) /** JSX */ => {
    // States
    const [loading /**boolean */, setLoading /**Funct<T, T> */] = useState(false);
    const [coins /**Array<coinsDTO> */, setCoins /**Funct<T, T> */] = useState([]);

    // Effects
    useEffect(() => {
        getCoins();
    }, []);
    async function getCoins(){
        setLoading(true);
        const coinsRequest /**Request*/ = await fetch("/home/coins");
        setLoading(false);
        if(coinsRequest.ok){
            const coinsResp /** {coins: Object, _id: String} */ = await coinsRequest.json()
            setCoins(coinsResp.coins);
        }
    }
    const bgStyle /**Object<String, String> */= {
        backgroundImage: `url(${imgBg})`, // SVG Background
        backgroundSize: "contain",
        minHeight: "250px",
        backgroundcolor: "white"
        
    }
    return (
        <>
            {
            loading ?
            <Loading /> : 
            <div className="coinRatesDiv" style={bgStyle}>
                <h2>Exchange Rates</h2>
                <div className="coinRates" >
                    {coins.length > 0 ? <header>
                        <p>Name</p>
                        <p >Current Price</p>
                        <p>24h Change</p>
                    </header>: <></>}
                    {
                        coins.map((coin /** coinsDTO */ , idx /**Number */)=> (
                            <section className="coinRateSection" key={idx}>
                                <main>
                                    <img
                                    src={coin.image} alt={coin.symbol} />
                                    <span>
                                        {coin.id.charAt(0).toUpperCase() + coin.id.slice(1)}
                                     </span>
                                    <span style={{color: "grey"}}> {coin.symbol.toUpperCase()}</span>
                                </main>
                                <main className="teal" style={{textAlign: "end"}}>
                                    <span>
                                    {coin.current_price.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    })}
                                    </span>
                                </main>
                                <main >
                                    {
                                        
                                        <span style={{color: 
                                            coin.market_cap_change_percentage_24h > 0 ? "green": "maroon"}}>
                                            {coin.market_cap_change_percentage_24h}</span>
                                    }
                                </main>
                            </section>
                        ))
                    }
                </div>
            </div>
            }
        </>
    )
}


const Investments /**Component */ = (props /** {[key: String]: any} */)/** JSX */ => {
    // States
    const [loading /**boolean */, setLoading /**Funct<T, T> */] = useState(false);
    const [investments /**Array<Investment> */, setInvestments /**Funct<T, T> */] = useState([]);

    // Events
    useEffect(() => {
        getInvestments();
    }, [])
    async function getInvestments() /**void */{
        setLoading(true);
        const req /**Request*/ = await fetch("/home/investments");

        setLoading(false);
        if(req.ok){
           const investments /**Array<Investment> */ = await req.json();
           setInvestments(investments);
        }
    }

    return (
        <>
            {
                loading ? <Loading /> :
                <div className="investmentsHomeDiv">
                    <h2>Start earning now!</h2>
                    <div className="investmentsHomeDiv">
                    
                    {
                        investments.map((investment, idx) => (
                            <div className="investmentCardDiv" key={investment._id}>
                                <section className="headerSection">
                                    <h4>{investment.desc}</h4>
                                </section>
                                
                                <section className="investmentDetails">
                                    <section>
                                        <h5>
                                            Minimum Amount
                                            <HiCurrencyDollar />
                                        </h5>
                                        <h3>
                                            {investment.amount.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                        </h3>
                                    </section>

                                    <section>
                                        <h5>
                                            Percent Return 
                                            <FaArrowUp />
                                        </h5>
                                        <h3> 
                                            { investment.yieldValue}%  
                                        </h3>
                                    </section>
                                </section>

                                <section className="waitPeriod">
                                        <h5>
                                            Maximum wait Period 
                                            <BsFillCalendar2CheckFill />
                                        </h5>
                                        <h3> 
                                            { investment.waitPeriod} days
                                        </h3>
                                </section>

                                <section className="investmentSectionBtn">
                                    <a href="./acct/home">
                                        <button>
                                            
                                                Start Earning
                                                <GrLineChart />
                                                {/* <TiChartLine /> */}
    
                                            
                                        </button>
                                    </a>
                                </section>
                            </div>
                        ))
                    }
                </div>
                </div>
            }
        </>
    )
}

const HomePage /**Component */ = (props) => {
    return (
    <div>
        <NavigationBar active='' />
        <HomePageIntro />
        <CoinsRate />
        <Investments />
    </div>)
}

export {HomePage};