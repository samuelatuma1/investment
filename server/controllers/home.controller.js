const {IIntroService} = require("../services/homepage.intro.service");
const {IStatsService} = require("../services/homepage.stats.service");  
const { IAuthService } = require("../services/auth.service");
const {ICoinRatesService } = require("../services/homepage.coinrates.service");
const { IInvestmentService } = require("../services/investment.service");
// DTOS
const Stats /** {[key: string] : {[key: string] : string}} */ = {
    stats1: {
        data: String,
        desc: String,
    },
    stats2: {
        data: String,
        desc: String,
    },
    stats3: {
        data: String,
        desc: String,
    },
    stats4: {
        data: String,
        desc: String,
    }
}
// @Path("home")
class HomeController {
    /**IIntroService */
    introService;
    /** IAuthService */
    authService;
    /**IStatsService */
    statsService
    /**ICoinRatesService */
    coinRatesService

    /**IInvestmentService */
    investmentService
    /**
     * @param {IIntroService} introService 
     * @param {IAuthService} authService
     * @param {IStatsService} statsService
     * @param {ICoinRatesService} coinRateService
     * @param {IInvestmentService} investmentService
     */
    constructor( 
        introService /**IIntroService */, 
        authService /**IAuthService */, 
        statsService /** IStatsService */,
        coinRateService /**ICoinRatesService */,
        investmentService /**IInvestmentService */){
        this.introService = introService;
        this.authService = authService;
        this.statsService = statsService;
        this.coinRatesService = coinRateService
        this.investmentService = investmentService;
    }

    /** 
     * @method POST /intro
     * @desc Allows only admin upload intro data
     * @protected (userId in req.userId | admin access required)
     * @req {body: {
     *  IntroDTO: {
     *      heading: String,
     *      body: String,
     *      adminWhatsappNum: String
     *   },
     *  file: {
     *   fieldname: String,
     *   mimetype: String,
     *   destination: String,
     *   filename: String,
     *   path: String,
     *   size: Number
     *  }
     * }
     * }
     * }
     * 
     * @returns { Response<Intro> }
    */
    createIntro = async (req /**Request */, res /**Response */)/**ResponseEntity<Intro> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to updload Intro"});

            const {heading /**String */, body /**String */, adminWhatsappNum /** String */} = req.body;
            if(!heading || !body || !adminWhatsappNum){
                return res.status(403).json({error: "Please, include a valid heading, body and whatsapp number"});
            }
            const fileData /**FileSchema  */ = req.file;
            if(!fileData){
                return res.status(403).json({error: "Please, include a valid image"});
            }
            const intro /**Intro */ = await this.introService.createIntro( {heading, body, adminWhatsappNum}, fileData, req);
            console.log("This is the intro", intro);
            return res.status(201).json({intro});
        } catch(ex /**Message */){
            console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }

    /**
     *  @method POST /stats
     *  @desc Allows only admin upload stats data
     *  @protected (userId in req.userId | admin access required)
     *  @param {{body: Stats}} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<Stats>}
     */
    createStats = async ( req /**Request */, res /**Response */) /**ResponseEntity<Stats> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to create stats"});
            
            
            const stats /**Stats */ = req.body;
            console.log(stats)
            if(!stats.stats1 || !stats.stats2 || !stats.stats3 || !stats.stats4){
                return res.status(400).json({stats, error: "Some data missing"})
            }
            const savedStats = await this.statsService.saveOne(stats);
            return res.status(201).json({savedStats});
        }catch(ex /** Exception */){
            console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }

    /**
      * @method GET /stats
      * @PROTECTED Accessible to all users
     *  @desc Returns the current HomePage Stats Document or null
     *  @returns {Response<{stats: Stats?}>} returns Stats or null
     */
    getStats = async (req /**Request */, res /**Response */) /**Response<> */ => {
        try{
            const stats /**Stats */ = await this.statsService.get();
            return res.status(200).json({stats});
        }catch(ex /**Message */){
            console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }
        
    /**
      * @method GET /intro
      * @PROTECTED Accessible to all users
     *  @desc Returns the current HomePage Intro Document or null
     *  @returns {Response<Intro, Stats>} returns Intro, with an extra parameter (imgUrl), and Stats
     */
     getIntro = async (req /**Request */, res /**Response */) /**Response<Intro, Stats> */ => {
        try{
            const intro /**Intro */ = await this.introService.getIntro(req);
            const stats /**Stats */ = await this.statsService.get();
            return res.status(200).json({intro, stats});
        } catch(err /**Exception */){
            return res.status(400).json({error: err.message});
        }
     }

     /**
      * @method GET /coins
      * @PROTECTED Accessible to all users
      * @return {CoinRates}
      */
     getCoins = async (req /**Request */, res /**Response */) /**Response<CoinRates> */ => {
        try{
            const response /**CoinRates */ = await this.coinRatesService.retrieveCoins();
            return res.status(200).json(response);
        } catch( ex /**Exception */){
            return res.status(400).json({error: err.message});
        }
     }


     /**
      * @method GET /investments
      * @PROTECTED Accessible to all users
      * @return {Array<Investment>}
      */
     getInvestments = async (req /**Request */, res /**Response */) /**Response<> */ => {
        try{
            const investments /**Array<Investment>*/ = await this.investmentService.retrieveInvestments();
            return res.status(200).json(investments);
        } catch( ex /**Exception */){ 
            return res.status(400).json({error: err.message});
        }
     }

}

module.exports = {HomeController};