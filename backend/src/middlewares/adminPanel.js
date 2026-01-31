const userModel = require('../models/user.models')
const asyncHandler = require('./asyncHandler')


const recuriterPanel = asyncHandler(async(req,res,next)=>{
    const user = req.user

    const currentUser = await userModel.findById(user).select("role")

    if(!currentUser){
        return res.status(401).json({
            message:"user is not avaible"
        })
    }
    
    if(currentUser.role !== "recruiter"){
       return res.status(400).json({
            message:"your not recruiter not allowed!"
        })
    } 

    next();
})

module.exports = recuriterPanel