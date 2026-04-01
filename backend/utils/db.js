const mongoose=require("mongoose")
const logger=require("./logger")


const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });

        logger.info(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        logger.error('Database connection failed:',error);
        process.exit(1);
    }
};


module.exports=connectDB
