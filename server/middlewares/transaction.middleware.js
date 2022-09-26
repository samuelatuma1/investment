const {check} = require("express-validator");

const transactionValidator = [
    check("amount").isNumeric()
        .withMessage("Each transaction must have an amount that is numeric")
]

module.exports = {transactionValidator};

