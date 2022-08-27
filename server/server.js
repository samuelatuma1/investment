require("dotenv").config()
// DB Setup
const {MongooseSetup} = require("./config.js")
const DBURI = process.env.MONGOURI
new MongooseSetup().configDB(DBURI)

const {app} = require("./index.js")

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))