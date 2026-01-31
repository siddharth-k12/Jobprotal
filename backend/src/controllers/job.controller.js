const jobModel = require('../models/job.models')
const asyncHandler = require('../middlewares/asyncHandler')
const userModel = require('../models/user.models')
const companyModel = require('../models/company.models')


//yha job create ho gi
const createJobController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {companyId} = req.params

    const recureterInCompany = await companyModel.findOne({_id:companyId , createAt : userId})
    console.log(userId);
    
    if(!recureterInCompany){
        return res.status(400).json({
            message:"your are not create job"
        })
    }
     
    const {title,description,requirement,jobType,workMode,
        location,exprienceLevel,salaryRange,statusNow} = req.body      

        if(!title || !description  || !location || !salaryRange){
            return res.status(400).json({
                message:"all filed compalasry"
            })
        }
        if(!requirement || !Array.isArray(requirement) || requirement.length === 0){
            return res.status(400).json({
                message:"requirement is must be not empty"
            })
        }
        const jobForm = await jobModel.create({
            companyId,
            recuriterId:userId,
            title,
            description,
            requirement,
            jobType,
            workMode,
            location,
            exprienceLevel,
            salaryRange,
            statusNow
        })

        return res.status(201).json({
            message:"job form submit",
            jobForm
        })

})

//job updated
const jobUpdateController = asyncHandler(async(req,res)=>{
    const {jobId,companyId} = req.params

    const checkJob = await jobModel.findOne({_id:jobId ,companyId})

    if(!checkJob){
        return res.status(404).json({
            message:"companay not found or userId is wrong"
        })
    }

     const {title,description,requirement,jobType,workMode,
        location,exprienceLevel,salaryRange,statusNow} = req.body 

    const setData= {}

    if(title !== undefined) setData.title = title
    if(description !== undefined) setData.description = description
    if(requirement !== undefined) setData.requirement = requirement
    if(jobType !== undefined) setData.jobType = jobType
    if(workMode !== undefined) setData.workMode = workMode
    if(location !== undefined) setData.location = location
    if(exprienceLevel !== undefined) setData.exprienceLevel = exprienceLevel
    if(salaryRange !== undefined) setData.salaryRange = salaryRange
    if(statusNow !== undefined) setData.statusNow = statusNow

    const profile = await jobModel.findOneAndUpdate(
        {_id: jobId,companyId},
        {$set:setData},
        {new:true}
    )   

    if(Object.keys(setData).length === 0){
        return res.status(400).json({
            message:"not to updated"
        })
    }

    return res.status(200).json({
        message:"job updated succesfully",
        profile
    })
})

//job delete
const jobDeleteController = asyncHandler(async(req,res)=>{
    const {companyId , jobId} = req.params
    const userId = req.user
    const checkId = await jobModel.findOneAndDelete({_id:jobId ,
         companyId ,recuriterId:userId})

    if(!checkId){
        return res.status(404).json({
            message:"not found job or not authorize"
        })
    }

    return res.status(200).json({
        message:"job is delete",
        checkId
    })
})

const allJobController = asyncHandler(async(req,res)=>{
    const jobs = await jobModel.find().populate("companyId","companyName")
    
    return res.status(200).json({
        message:"all jobs",
        jobs,
    })
})

const jobIdController = asyncHandler(async(req,res)=>{
    const {jobId} = req.params
    const job = await jobModel.findById(jobId).populate("companyId","companyName")
    return res.status(200).json({
        messae:"job is search",
        job
    })
})

const companyJobController = asyncHandler(async(req,res)=>{
    const {companyId} = req.params
    const user = req.user

    const companyJob = await jobModel.find({recuriterId:user ,companyId:companyId})

    if(!companyJob){
        return res.status(400).json({
            message:"no job in the companies ",
        })
    }
    return res.status(200).json({
        message:"all jobs her",
        companyJob
    })
})
 const searchJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    let filter = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await jobModel.find(filter)
      .populate("companyId")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};


module.exports = {
    createJobController,
    jobUpdateController,
    jobDeleteController,
    allJobController,
    jobIdController,
    companyJobController,
    searchJobs
}