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
const {HowToEarnService} = require("../services/homepage.howToEarn.service.js");
const {ReviewService} = require("../services/home.review.service.js");
const {FooterService} = require("../services/footer.service.js");

const uploadImageHandler = new UploadImage();
const home /**HomeController */ = new HomeController(new IntroService(), new AuthService(), 
new StatsService(), new CoinRatesService(), new InvestmentService(), 
new HowToEarnService(), new ReviewService(), new FooterService());

// @Path /home
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

homeRoute.route("/howtoearnimage")
        .post(
            ValidateToken.validateToken, 
        uploadImageHandler.uploadImg().single("img"),
        home.createHowToEarnImage
        )
        .get(home.getHowToEarnImage);

homeRoute.route("/howtoearn")
        .post(ValidateToken.validateToken, home.createHowToEarn)
        .get(home.getHowToEarn)

homeRoute.route("/getfullhowtoearn")
        .get(home.getFullHowToEarn);

homeRoute.route("/addreviews")
        .post(ValidateToken.validateToken, home.addReviews)

homeRoute.route("/getreviews")
        .get(home.getReviews);

homeRoute.route("/footer")
        .post(ValidateToken.validateToken, home.createFooter)
        .get(home.getFooter);
module.exports = {homeRoute};

