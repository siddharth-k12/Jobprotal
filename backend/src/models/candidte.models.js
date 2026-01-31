const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    degree:{type:String , required:true,trim:true},
    collogeName:{type:String , required:true,trim:true},
    startYear:{type:Number , required:true},
    endYear:{type:Number , required:true}
})

const exprienceSchema = new mongoose.Schema({
    jobRole:{type:String,trim:true},
    companyName:{type:String,trim:true},
    employeType:{
        type:String,
        enum:["full-time","intern","part-time"],
        default:"full-time"
    },
    startDate:{type:Date},
    endDate:{type:Date},
    isCurrent:{type:Boolean,default:false}
})



const candidateProfileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },
    headline:{
        type:String,
        trim:true
    },
    skills:[{type:String,trim:true }],
     location:{type:String,trim:true},

    education:[educationSchema],
    experience:[exprienceSchema],

    },
    {timestamps:true}
)

const candidateModel = mongoose.model("candidate",candidateProfileSchema)


module.exports = candidateModel