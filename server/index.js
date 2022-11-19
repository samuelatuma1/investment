const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()


const app = express()

// Security Setup
app.use(helmet());

// app.use(helmet({
//     crossOriginResourcePolicy: false,
//     policy: "cross-origin"
//   }))


// access cookies
app.use(cookieParser())

// Allow POST Data
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Use cors to allow react
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', "POST", "PUT", "DELETE"],
    credentials: true
}
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// Routes
    
const {authRoute} = require("./routes/auth.route.js")
app.use("/auth", authRoute)

const {accountRoute} = require("./routes/account.route.js");
app.use("/account", accountRoute);

const {transactionRoute} = require("./routes/transaction.route.js");
app.use("/transaction", transactionRoute);

const {investmentRoute} = require("./routes/investment.route.js");
app.use("/investment", investmentRoute);

const {withdrawalRoute} = require("./routes/withdrawal.route.js");
app.use("/withdrawal", withdrawalRoute);

const {homeRoute} = require("./routes/home.route.js");
app.use("/home", homeRoute);


// Testing uploading images
const {UploadImage} = require("./middlewares/uploadimg.middleware");

app.post("/product/upload", new UploadImage().uploadImg().single("introImg"), (request /** Request */, response /** Request */)/** ResponseEntity<> */ => {
    return response.status(200).json({files: request.file});
}) 

const fs /**fs */ = require('node:fs/promises');
app.delete("/product", async (request /**Request */, res /**Response */ ) /**ResponseEntity<> */ => {
    try{
        const filepath /**URL */ = request.body.url;
        await fs.unlink(filepath);
        return res.sendStatus(204);
    } catch(err /**Exception */){
        console.log(err.message);
        return res.sendStatus(400);

    }
})


// static files
app.use("/media", express.static("media"))
module.exports = {app}