"use strict"
const {validationResult} = require("express-validator")


class Auth{
    constructor(authService, mailService, accountService){
        this.authService = authService;
        this.mailService = mailService;
        this.accountService = accountService;
    }

    /**
     * @desc Signs up a user creates account(Transaction account) for user in the process
     * @METHOD POST /auth/signup
     * @param req {<
     *              reqParams={},
     *              resBody={},
     *              reqBody={
     *                  fullName: string,
     *                  email: email(String), password: string
     *                  retypePassword: string
     * }
     *  >}
     */
    signup = async (req, res) => {
        try{
            const formErrors = validationResult(req).errors
            if(formErrors.length > 0){
                return res.status(200).json({formErrors})
            }
            console.log("res.body", req.body)
            const savedUser = await this.authService.saveUser(req)

            //  Create account for user in the process of creating user
            const _id = savedUser._id;
            const userTransactionAcct = await this.accountService.createAccount(_id);
            console.log({userTransactionAcct});

            // Send Verification Mail
            let verificationMail;
            try{
                verificationMail = await this.mailService.sendVerificationMail(req, savedUser)
            } catch(err){
                const removedMail = await this.authService.deleteOne({email: req.body.email})
                    console.log({removedMail})
                    return res.sendStatus(400)
            }
            
            res.status(201).json({savedUser: savedUser.toObject()})
        } catch(err){
            console.log(err)
            return res.status(403).json({error: "user with email already exists"})
        }
    }

    /**
     * @desc verifies mail, creates account(Transaction account) for user in the process
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    verifyMail = async (req, res) => {
        try{
            // Get signed token
            const token = req.params.signedToken
            const validatedUser = await this.authService.verifyEmail(token)

            

            return res.status(200).json({validatedUser})
        } catch(err){
            console.log(err)
            return res.status(403).json({error: "Token invalid or does not exist"})
        }
    }

     /**
     * @desc Signs up a user
     * @METHOD POST /auth/signin
     * @param req {<
     *              reqParams={},
     *              resBody={},
     *              reqBody={
     *                  email: email(String),       
     *                  password: string
     * }
     *  >}
     */
    signin = async (req, res) => {
        try{
            const {email, password} = req.body
            if(!email || !password){
                return res.status(400).json({"error": "Please input email and password"})
            }
            const user = await this.authService.authenticate(email, password)
            if(!user){
                return res.status(400).json({"error": "username or password invalid"})
            }
            console.log(user)
            if(!user.isActive){
                return res.status(403).json({error: "account not activated"})
            }
            // User is valid, with signed token in key -> token
            res.cookie("token", user.token)
            console.log("cookies", req.cookies)
            const {_id /*: BsonObject */, fullName /*: String */} = user
            return res.status(200).json({email, _id, fullName, token: user.token})
        } catch(err){
            console.log(err)
            return res.status(400).json({error: "Authentication failed"})
        } 
    }
    /**
     * @desc checks if a user is signed in using token 
     * @METHOD GET /auth//userIsSignedIn/:token
     * @param req {
     *              reqParams={},
     *              resBody={},
     *              reqBody={}
     }

     */
    userIsSignedIn = async (req /*: Request */, res /*: Response */) /*: json({isSignedIn: boolean}) */ => {
        try{
            const token /*: JWTToken */ = req.params.token;
            const isSignedIn /*: boolean */ = await this.authService.userIsSignedIn(token);
            return res.status(200).json({isSignedIn});
        } catch(err){
            console.log(err.message);
            return res.status(200).json({isSignedIn: false});
        }
    }
}

module.exports = {Auth}