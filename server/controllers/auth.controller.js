"use strict"
const {validationResult} = require("express-validator")


class Auth{
    constructor(authService, mailService){
        this.authService = authService
        this.mailService = mailService
    }
    signup = async (req, res) => {
        try{
            const formErrors = validationResult(req).errors
            if(formErrors.length > 0){
                return res.status(403).json({formErrors})
            }
            console.log("res.body", req.body)
            const savedUser = await this.authService.saveUser(req)

            // Send Verification Mail
            const verificationMail = await this.mailService.sendVerificationMail(req, savedUser)
            
            res.status(201).json({savedUser: savedUser.toObject()})
        } catch(err){
            console.dir(err)
            return res.status(403).json({error: "user with email already exists"})
        }
    }

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
            if(!user.isActive){
                return res.status(403).json({error: "account not activated"})
            }
            // User is valid, with signed token in key -> token
            res.cookie("token", user.token)
            console.log("cookies", req.cookies)
            const {_id} = user
            return res.status(200).json({email, _id, token: user.token})
        } catch(err){
            console.log(err)
            return res.status(403).json({error: "Authentication failed"})
        }
    }
}

module.exports = {Auth}