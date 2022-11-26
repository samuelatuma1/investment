const express = require("express")
const homeRoute /**Router */ = express.Router()
const {AuthService} = require("../services/auth.service.js");
const {ValidateToken} = require("../middlewares/token.middleware.js");

const {IntroService} = require("../services/homepage.intro.service");
const { StatsService } =  require("../services/homepage.stats.service.js");

const {HomeController} = require("../controllers/home.controller");

const {UploadImage} = require("../middlewares/uploadimg.middleware.js");

const { CoinRatesService } = require("../services/homepage.coinrates.service.js");
const { InvestmentService } = require("../services/investment.service.js");


const uploadImageHandler = new UploadImage();
const home /**HomeController */ = new HomeController(new IntroService(), new AuthService(), new StatsService(), new CoinRatesService(), new InvestmentService());

homeRoute.route("/intro")
    .post(ValidateToken.validateToken, 
        uploadImageHandler.uploadImg().single("img"),
        home.createIntro)
    .get(home.getIntro);

homeRoute.route("/stats")
        .get(home.getStats)
        .post(ValidateToken.validateToken, home.createStats);

homeRoute.route("/coins")
        .get(home.getCoins);

homeRoute.route("/investments")
        .get(home.getInvestments);
module.exports = {homeRoute};

