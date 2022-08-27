const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()


const app = express()

// Security Setup
app.use(helmet())

// access cookies
app.use(cookieParser())

// Allow POST Data
app.use(express.urlencoded({extended: true}))
app.use(express.json())






// CORS
app.use(cors({
    origin: "http://localhost:3000"
}))

// Routes
const {authRoute} = require("./routes/auth.route.js")
app.use("/auth", authRoute)

module.exports = {app}