"use strict"
const {User} = require("../models/auth.model.js")
const {Mail} = require("./mail.service.js")
const crypto = require("crypto")
const {JWTService} = require("./jwt.service.js")

class IAuthService {
    /**
     * @desc hashes User Password, saves user taking {email, password, fullName} from req.body
     * @param req : Request Object
     * @returns {Promise<savedUser>} Object
     * @error Throws error if email already exists
     */
     async saveUser(req){}

      /**
     * @desc Takes in JWTToken, and activates User if jwt is valid
     * @param {JWTToken} token 
     * @returns {Promise<User>}
     */
     verifyEmail = async (token) => {}

     /**
      * 
      * @param {String} email 
      * @param {String} password 
      * @returns {Promise<User>?}
      */
     authenticate = async (email, password) => {}

     /**
     * 
     * @param {object} obj : The matching condition
     * @desc Deletes the first document that matches conditions from db
     */
    deleteOne = async (obj) => {}

    /**
     * uses token, verifies if user is signed in, returns boolean
     * @param {JWTToken} token 
     * @returns {Promise<boolean>}
     */
     userIsSignedIn = async (token) => {}

     /**
     * 
     * @desc checks if a user is admin given a  JWTToken
     * @param {JWTToken} token JWTToken that would be decrypted to figure out if user is admin
     * @returns {Promise<boolean>}
     */
      userIsAdmin = async (token /**: JWTToken */ ) /*: boolean */ => {}

      /**
     * @desc checks if a user is admin given an ObjectId
     * @param {ObjectId} userId The Id of the user
     * @returns {Promise<boolean>}
     */
    verifyIsAdminFromId = async (userId /**: ObjectId */, ) /*: boolean */ => {}

    /**
     * @desc retrieves user with the given id
     * @param {ObjectId} userId 
     * @returns {Promise<User>?}
     */
     retrieveUserById = async (userId) => {}
}





class AuthService{
    constructor(){}
    /**
     * @desc hashes User Password, saves user taking {email, password, fullName} from req.body
     * @param req : Request Object
     *  @returns {Promise<savedUser>} Object
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
     * @returns {User}
     */
    verifyEmail = async (token) => {
        try {
            // unhash token 
            const _id = JWTService.verifyToken(token, process.env.JWT_KEY)
            // Check whose email matches token
            // Result of _id is hashed as {email: emailAddress}
            const userToVerify = await User.findOne(_id)
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
            const token = JWTService.signToken({_id: user._id}, process.env.JWT_KEY)
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

    /**
     * 
     * @param {JWTToken} token 
     * @returns {boolean}
     */
    userIsSignedIn = async (token) => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, process.env.JWT_KEY);
        if(!decryptedToken){
            return false;
        }
        return true;
        } catch(err){
            return false;
        }
    }

    /**
     * @param {string} token
     * @returns {boolean}
     */
    userIsAdmin = async (token /**: JWTToken */, ) /*: boolean */ => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, process.env.JWT_KEY);

        if(!decryptedToken){
            return false;
        }

        const {_id} /*: ObjectId */ = decryptedToken;
        const user /*: User */ = await User.findById(_id);
        if(user != null){
            return user.isAdmin;
        }
        return false;
        } catch(err){
            return false;
        }
    }

    /**
     * 
     * @desc checks if a user is admin given a  JWTToken
     * @param {JWTToken} token JWTToken that would be decrypted to figure out if user is admin
     * @returns {boolean}
     */
     userIsAdmin = async (token /**: JWTToken */ ) /*: boolean */ => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, process.env.JWT_KEY);

        if(!decryptedToken){
            return false;
        }

        const {_id} /*: ObjectId */ = decryptedToken;
        const user /*: User */ = await User.findById(_id);
        if(user != null){
            return user.isAdmin;
        }
        return false;
        } catch(err){
            return false;
        }
    }
    /**
     * @desc checks if a user is admin given an ObjectId
     * @param {ObjectId} userId The Id of the user
     * @returns {boolean}
     */
    verifyIsAdminFromId = async (userId /**: ObjectId */, ) /*: boolean */ => {
       
        try{
            const _id /*: ObjectId */ = userId;
            console.log({_id})
            const user /*: User */ = await User.findById(_id);
            if(user != null){
                return user.isAdmin;
            }
            return false;
        } catch(err){
            return false;
        }
    }

    /**
     * @desc retrieves user with the given id
     * @param {ObjectId} userId 
     */
    retrieveUserById = async (userId) => {
        const user /*: User*/ = await User.findById(userId).select({password: 0});
        

        return user;
    }
}

module.exports = {AuthService, IAuthService}

