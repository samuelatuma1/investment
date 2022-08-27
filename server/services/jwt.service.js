const jwt = require("jsonwebtoken")

class JWTService{
   
    static signToken(token, key, expiresIn=(60 * 60* 24 *30)){
        return jwt.sign(token, key, {expiresIn: `${expiresIn}s`})
    }

    static verifyToken = (token, key) => {
        jwt.verify(token, key, (err, verifiedToken) => {
            if(err){
                throw new Error(err)
            }
            else{
                return verifiedToken
            }
        })
    }
}

module.exports = {JWTService}