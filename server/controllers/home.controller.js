const {IIntroService} = require("../services/homepage.intro.service");

// @Path("home")
class HomeController {
    /**IIntroService */
    introService;

    /**
     * @param {IIntroService} introService 
     * @param {IAuthService} authService
     */
    constructor( introService /**IIntroService */, authService /**IAuthService */){
        this.introService = introService;
        this.authService = authService;
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
                return res.status(403).json({message: "You are not permitted to retrieve withdrawals"});

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
      * @method GET /intro
      * @PROTECTED Accessible to all users
     * @desc Returns the current HomePage Intro Document or null
     * @returns {Response<Intro>} returns Intro, with an extra parameter (imgUrl)
     */
     getIntro = async (req /**Request */, res /**Response */) /**Response<Intro> */ => {
        try{
            const intro /**Intro */ = await this.introService.getIntro(req);
            return res.status(200).json({intro});
        } catch(err /**Exception */){
            return res.status(400).json({error: err.message});
        }

     }

    
}

module.exports = {HomeController};