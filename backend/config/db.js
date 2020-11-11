const mongoose= require('mongoose')
const dotenv= require('dotenv')
dotenv.config()
const connectDB= async()=> {
    try{
        console.log(process.env.MONGO_URI);
        const conn=await mongoose.connect(process.env.MONGO_URI, { 
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
    })
    console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch( error){
        console.log(`Error: ${error.message}`);
        
    }
}

module.exports= connectDB;