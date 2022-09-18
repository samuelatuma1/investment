const express = require("express")
const authRoute = express.Router()

// Import controller
const {Auth} =require("../controllers/auth.controller.js")
// import middlewares
const {signUpValidator} = require("../middlewares/auth.middleware.js")

// services
const {AuthService} = require("../services/auth.service.js")
const {Mail} = require("../services/mail.service.js")

const mailServiceProvider = process.env.service
const email_username = process.env.email_username
const email_password = process.env.email_password
// console.log({email_password})
const auth = new Auth(new AuthService(), 
    new Mail(mailServiceProvider, email_username, email_password))

authRoute.route("/signup")
    .post(signUpValidator, auth.signup)

authRoute.route("/verifymail/:signedToken")
    .get(auth.verifyMail)
    
authRoute.route("/signin")
    .post(auth.signin)

module.exports = {authRoute}
