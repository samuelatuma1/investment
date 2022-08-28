"use strict"
const {User} = require("../models/auth.model.js")
const {Mail} = require("./mail.service.js")
const crypto = require("crypto")
const {JWTService} = require("./jwt.service.js")

class AuthService{
    constructor(){}
    /**
     * @desc hashes User Password, saves user taking {email, password, fullName} from req.body
     * @param req : Request Object
     * @returns savedUser Object
     * @error Throws error if email already exists
     */
    async saveUser(req){
        try{
            const {email, password, fullName} = req.body
            // Hash password
            const hashedPassword = crypto.createHmac("sha256", process.env.HashKey)
                .update(password).digest("hex")

            const newUser = await new User({email, fullName,  password: hashedPassword})
            return await newUser.save()
        } catch(err){
            
            throw new Error(err)
        }  
    }
    /**
     * @desc Takes in JWTToken, and activates User if jwt is valid
     * @param {JWTToken} token 
     * @returns 
     */
    verifyEmail = async (token) => {
        try {
            // unhash token 
            const email = JWTService.verifyToken(token, process.env.JWT_KEY)
            // Check whose email matches token
            // Result of email is hashed as {email: emailAddress}
            const userToVerify = await User.findOne(email)
            userToVerify.isActive = true
            const savedUser = await userToVerify.save()
            return savedUser

        } catch(err){
            throw new Error(err)
        }
    }

    authenticate = async (email, password) => {
        
        // Hash password
        const hashedPassword = crypto.createHmac("sha256", process.env.HashKey)
                .update(password).digest("hex")
        const user = await User.findOne({email, password: hashedPassword})
        // if user is add token to data
        if(user){
            const token = JWTService.signToken({email: user.email}, process.env.JWT_KEY)
            user.token = token
        }
        return user
    }
    /**
     * 
     * @param {object} obj : The matching condition
     * @desc Deletes the first document that matches conditions from db
     */
    deleteOne = async (obj) => {
        const deleteCount = await User.deleteOne(obj)
        return deleteCount
    }
}

module.exports = {AuthService}

