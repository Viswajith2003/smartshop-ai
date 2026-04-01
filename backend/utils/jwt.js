const jwt=require("jsonwebtoken")
const logger=require('./logger')

const generateUserToken= (payload) =>{
    try {
        return jwt.sign(payload,process.env.JWT_USER_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN
        })
    } catch (error) {
        logger.error("Error generating user token:",error);
    }
}

const verfiyUserToken=(token)=>{
    try {
        if(!projcess.env.JWT_USER_SECRET){
            throw new Error('JWT_USER_SECRET not configured');
        }
        return jwt.verify(token,projcess.env.JWT_USER_SECRET)
    } catch (error) {
        throw new Error('Token verfication failed')
    }
}

module.export={
    generateUserToken,
    verfiyUserToken,
}