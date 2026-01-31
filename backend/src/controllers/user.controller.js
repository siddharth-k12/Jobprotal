const asyncHandler = require('../middlewares/asyncHandler')
const userModel = require('../models/user.models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerHandler = asyncHandler(async(req,res)=>{
    let {username,password,email,phoneNumber} = req.body

    //check all thing requred or not
    if(!username.trim() || !password.trim() || !email.trim()){
        return res.status(400).json({
            message:"username , password , email is required"
        })
    }
    //check if phone number is equal to 10 or not
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
  return res.status(400).json({
     message: "Phone number must be exactly 10 digits"
     });
}

    email = email.toLowerCase().trim();

    if(!email?.trim() || !password?.trim() || !username?.trim()){
        return res.status(400).json({
            message:"email , password and username is not empty"
        })
    }
    //check user
    const checkUser = await userModel.findOne({email})
    
    if(checkUser){
        return res.status(409).json({
            message:"Email already exist"
        })
    }

    //check password 
    const hashPassword = await bcrypt.hash(password,10);

    

    const newUser = await userModel.create({
        username,
        password:hashPassword,
        email,
        phoneNumber,
    })

    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"5m"})
    res.cookie('token',token)
    return res.status(201).json({
        message:"User is created succesfully",
        user:{
            username:newUser.username,
            email:newUser.email,
            phoneNumber:newUser.phoneNumber
        },
        token
    })
})

const loginController = asyncHandler(async(req,res)=>{

 let {email,password} = req.body
    //validation
    if(!email.trim() || !password.trim()){
        return res.status(400).json({
            message:"email and password are required"
        })
    }
   
    email = email.toLowerCase().trim()

    //find user
    const user = await userModel.findOne({email});
    
    if(!user){
        return res.status(401).json({
            message:"Email is invalid"
        })
    }

    const checkPassword = await bcrypt.compare(password,user.password);

    if(!checkPassword){
        return res.status(401).json({
            message:"Password is wrong try again"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie('token',token)

    return res.status(200).json({
        message:"User is login",
        user,
        token
    })
})


const updateController = asyncHandler(async(req,res)=>{
    const {username,email,phoneNumber} = req.body

    const currentUserId = req.user

    const checkUser = await userModel.findById(currentUserId)

    if(!checkUser){
        return res.status(404).json({
            message:"user not found"
        })
    }

    const userInfo = {};

    //check email exist and also check in database same email are not exist
    if(email && email !== checkUser.email){
        const checkEmail = await userModel.findOne({email})
        if(checkEmail){
            return res.status(401).json({
            message:"email is already exist"
        })
        }
      userInfo.email = email 
    }

    if(phoneNumber && !/^\d{10}$/.test(phoneNumber)){
        return res.status(400).json({
            message:"Phone number should be 10 digits"
        })
    }
    if(phoneNumber)userInfo.phoneNumber = phoneNumber
    if(username)userInfo.username = username

    if(Object.keys(userInfo).length === 0){
        return res.status(400).json({
            message:"no valid filed updated"
        })
    }

    const updateUser = await userModel.findByIdAndUpdate(
        currentUserId,
        { $set:userInfo},
        {new:true}
    )
return res.status(200).json({
    messge:"user is update",
    updateUser
})
})

const passwordController = asyncHandler(async(req,res)=>{
    const {newPassword} = req.body

    const userId = req.user

    const user = await userModel.findById(userId)

    if(!user){
        return res.status(404).json({
            message:"user not exist"
        })
    }
    
    const hashPassword = await bcrypt.hash(newPassword,10);

    user.password = hashPassword
   await user.save();

return res.status(200).json({
    message:"password has changed"
})

}) 

const logoutUser = asyncHandler(async(req,res)=>{
    const {token} = req.cookies
    if(!token){
        res.status(400).json({
            message:"token is not avaible"
        })
    }
    res.clearCookie("token")
   res.status(200).json({
    message:"user is logout"
   })
})

const userAdminController = asyncHandler(async(req,res)=>{
    const user = req.user
   const currentUser = await userModel.findById(user).select("role")

    return res.status(200).json({
        message:"user role",
        currentUser
    })
})

const currenctUserController = asyncHandler(async(req,res)=>{
    const user = req.user
    const currentuser = await userModel.findById(user)
    if(!currentuser){
        res.status(404).json({
            message:"user is not found"
        })
    }
    return res.status(200).json({
        message:"current user data",
        currentuser
    })
})

module.exports = {
    registerHandler,
    loginController,
    updateController,
    passwordController,
    logoutUser,
    userAdminController,
    currenctUserController
}