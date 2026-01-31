const mongoose = require('mongoose');

//so there user is create there user deatil
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        enum:["candidate","recruiter"],
        default:"candidate"
    }

},{timestamps:true});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;