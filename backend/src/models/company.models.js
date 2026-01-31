const mongoose = require('mongoose')


const companySchema = new mongoose.Schema({
    companyName:{type:String,required:true,trim:true},

    website:{type:String,trim:true},

    industry:{type:String,trim:true,uppercase:true},

    size:{
        type:String,
        enum:["1-10","10-20","20-25","25-100","100+"],
        default:"1-10"
    },

    location:{type:String,trim:true},

    about:{type:String,trim:true},
    
    createAt:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
})

const companyModel = mongoose.model("company",companySchema)

module.exports = companyModel