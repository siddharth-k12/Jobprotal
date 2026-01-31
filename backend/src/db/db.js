const mongoose = require("mongoose");

const connectDB = ()=>{
    try {
        mongoose.connect(process.env.MONGOOSE_URL)
        console.log("Database is connected")
    } catch (error) {
        console.log("Database error",error);
        
    }
}

module.exports = connectDB