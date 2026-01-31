const saveModel = require('../models/saved.models')
const asyncHandler = require('../middlewares/asyncHandler')
// const { default: JobId } = require('../../../frontend/src/components/JobId')

const savedController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {jobId} = req.params

    const saveJob = await saveModel.findOne({userId , jobId}) 
    if(saveJob){
        return res.status(400).json({
            message:"saved job already exist"
        })
    }
    const job = await saveModel.create({
        userId,
        jobId
    })
    return res.status(200).json({
        message:"saved job is create",
        job
    })
})

const allSavedJobController = asyncHandler(async(req,res)=>{
    const userId = req.user
    // const {jobId} = req.params

    const savedJob = await saveModel.find({userId}).populate("jobId")

    if(!savedJob || savedJob.length === 0){
        return res.status(400).json({
            message:"no jobs avaible"
        })
    }
    return res.status(200).json({
        message:"all saved jobs",
        savedJob
    })
})

const deleteSavedController = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {jobId} = req.params

    const saved = await saveModel.findOneAndDelete({userId,jobId})

    if (!saved) {
    return res.status(404).json({
      message: "Saved job not found",
    });
  }

  return res.status(200).json({
    message: "Job removed from saved list",
  });
})

 const checkSavedController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { jobId } = req.params;

  const saved = await saveModel.findOne({ userId, jobId });

  return res.status(200).json({
    saved: !!saved // true or false
  });
});




module.exports = {
    savedController,
    allSavedJobController,
    deleteSavedController,
    checkSavedController
}