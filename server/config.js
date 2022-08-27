const mongoose = require("mongoose")

class MongooseSetup {
    async configDB(uri){
        
        await mongoose.connect(uri)
        console.log("Connected to DataBase ", uri)
    }
}

module.exports = {MongooseSetup}