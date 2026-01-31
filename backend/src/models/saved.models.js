const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job",
        required:true
    },
    saveAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

savedSchema.index({userId:1,jobId:1},{unique:true})

const savedModel = mongoose.model("saved",savedSchema)

module.exports = savedModel