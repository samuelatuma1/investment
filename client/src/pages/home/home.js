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

    return (
        <>
            {
            loading ?
            <Loading /> : 
            <div className="coinRatesDiv">
                <h2>Exchange Rates</h2>
                <div className="coinRates">
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

const HomePage /**Component */ = (props) => {
    return (
    <div>
        <NavigationBar active='' />
        <HomePageIntro />
        <CoinsRate />
    </div>)
}

export {HomePage};