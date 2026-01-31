const asyncHandler = require('../middlewares/asyncHandler');
const candidateModel = require('../models/candidte.models');



//skills in array check

const normalSkill = (skills)=>{
    if(skills === undefined || skills === null) return undefined;

    if(Array.isArray(skills)){
        return skills.map((s)=>String(s).trim()).filter(Boolean)
    }

    if(typeof skills === "string"){
        return skills.split(",").map((s)=>s.trim()).filter(Boolean)
    }

    if(typeof skills === "object"){
        return Object.values(skills).map((s)=>String(s).trim()).filter(Boolean)
    }

    return [String(skills).trim()].filter(Boolean)
}


const candidateProfileController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {headline,skills,location}= req.body

    if(!headline || !skills || !location  ){
        return res.status(400).json({
            message:"all filed is compalsary fill"
        })
    }

    //check user is exist in candidate 
    const checkUser = await candidateModel.findById(userId);
    if(checkUser){
        return res.status(400).json({
            message:"candidate profile already exist"
        })
    }
    // const formateSkills = normalSkill(skills)
    // if(formateSkills || formateSkills.length === 0){
    //     return res.status(400).json({
    //         message:"skills must be valid"
    //     })
    // }
    const profile = await candidateModel.create({
       userId, headline,skills,location
    })

    return res.status(201).json({
        message:"profile is create succesfully",
        profile
    })
},{new : true})

const candidateEducationController = asyncHandler(async(req,res)=>{
    const userId = req.user
    
    const {degree,collogeName,startYear,endYear} = req.body

    if(!degree || !collogeName || !startYear || !endYear){
        return res.status(400).json({
            message:"all filed is submit compalasry"
        })
    } 

    if(startYear > endYear){
        return res.status(400).json({
            message:"startYear is not bigger that endYear"
        })
    }
    const profile = await candidateModel.findOneAndUpdate(
        {userId},
        {
            $push:{
               education:{ degree,collogeName,startYear,endYear

               }
            }
        },{new:true}
    )

    if(!profile){
        return res.status(404).json({
            message:"profile is not found "
        })
    }

    return res.status(201).json({
        message:"education profile is create ",
        profile
    })
})

const candidateExpreienceController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {jobRole,companyName,employeType,startDate,endDate,isCurrent} = req.body

    const profile = await candidateModel.findOneAndUpdate({userId},{
        $push:{
            experience:{jobRole,companyName,employeType,startDate,endDate,isCurrent}
        }
    },{new:true})

    return res.json({
        message:"exprience is create",
        profile
    })
})


//edit all routes
const candidateProfileEditController = asyncHandler(async(req,res)=>{
    const userId = req.user

    const{headline,skills,location} = req.body

    const updateData = {}

    if(headline !== undefined) updateData.headline = headline
    
    if(location !== undefined) updateData.location = location


    const formateSkills = normalSkill(skills)
    if(formateSkills !== undefined) updateData.skills = formateSkills

    if(Object.keys(updateData).length === 0){
        return res.status(400).json({
            message:"nothing is updated"
        })
    }

    const profile = await candidateModel.findOneAndUpdate(
        {userId},
        {$set:updateData},
     {new:true}
    )

    return res.status(200).json({
        message:"updated",
        profile
    })
})

//education edit controller
const candidateEducationEditController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {educationId} = req.params

    const{degree,collogeName,startYear,endYear} = req.body

    const setData = {}

     if(startYear !== undefined && endYear !== undefined && startYear > endYear){
        return res.status(400).json({
            message:"Start year not bigger than endYear"
        })
    }
    if(degree !== undefined) setData["education.$.degree"] = degree
    if(collogeName !== undefined) setData["education.$.collogeName"] = collogeName
    if(startYear !== undefined) setData["education.$.startYear"] = startYear
    if(endYear !== undefined) setData["education.$.endYear"] = endYear

    
   
console.log(educationId)
    const profile = await candidateModel.findOneAndUpdate(
        {userId , "education._id":educationId},
        {$set:setData},           
        {new:true}
    )

    return res.status(200).json({
        message:"education updated",
        profile
    })
})

const candidateExpreienceEditController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {experienceId} = req.params 

    const {jobRole,companyName, employeType,startDate,endDate,isCurrent} = req.body

    const setData = {};

    if(jobRole !== undefined) setData["experience.$.jobRole"] = jobRole
    if(companyName !== undefined) setData["experience.$.companyName"] = companyName
    if(employeType !== undefined) setData["experience.$.employeType"] = employeType
    if(startDate !== undefined) setData["experience.$.startDate"] = startDate
    if(endDate !== undefined) setData["experience.$.endDate"] = endDate
    if(isCurrent !== undefined) setData["experience.$.isCurrent"] = isCurrent

    const profile = await candidateModel.findOneAndUpdate(
        {userId,"experience._id":experienceId},
        {$set:setData},
        {new:true}
    )

        res.status(200).json({
            message:"candidate experience updated",
            profile
        })

})

const getCandidateController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const candidate = await candidateModel.findOne({userId})
    // if(!candidate){
    //     return res.status(404).json({
    //         message:"candidate profile not exist"
    //     })
    // }
    return res.status(200).json({
    message:"candidate profile is : ",
    candidate
    })
})
module.exports = {
    candidateProfileController,
    candidateEducationController,
    candidateExpreienceController,
    //edit controller
    candidateProfileEditController,
    candidateEducationEditController,
    candidateExpreienceEditController,
    getCandidateController
}