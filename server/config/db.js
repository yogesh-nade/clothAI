const mongoose = require('mongoose')

// Database connection function
const connectDb = async() =>{
    try{
        // Connect to MongoDB using connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected.")

    }catch(error){
        console.log(error)
    }
}

module.exports = connectDb