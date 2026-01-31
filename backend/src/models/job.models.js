const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},

    description:{type:String,trim:true},

    requirement:[{type:String,trim:true}],

    jobType:{
        type:String,
        enum:["Full-time","Internship","Part-time"],
        default:"Full-time"
    },

    workMode:{
        type:String,
        enum:["Remote","Hybrid","Onsite"],
        default:"onsite"
    },
    location:{
        type:String,
        trim:true
    },
    exprienceLevel:{
        type:String,
    },
    salaryRange:{
        type:String,
        trim:true
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"company",
        required:true,
        
    },
    statusNow:{
        type:String,
        enum:["active","closed"],
        default:"active"
    },
    recuriterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    
    }
},{timestamps:true})


const jobModle = mongoose.model("job",jobSchema)

module.exports = jobModle