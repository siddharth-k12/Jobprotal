const asyncHandler = require('../middlewares/asyncHandler');
const applicationModel = require('../models/application.models');
const jobModle = require('../models/job.models');
const cloudinary = require('../utils/cloudnaryConfig')

function bufferToDataUri(file) {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

const applicationController = asyncHandler(async(req,res)=>{
    const {jobId} = req.params
    const userId = req.user
    
    const alreadyApplied = await applicationModel.findOne({jobId,userId})
    if(alreadyApplied){
        return res.status(409).json({
            message:"user is already applied"
        })
    }

       if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const dataUri = bufferToDataUri(req.file);

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "jobportal/resumes",
      resource_type: "raw", // IMPORTANT for PDF
    });

    const application = await applicationModel.create({
        jobId,
        userId,
        statusNow:"applied",
        resume:{
        url: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
        }
    })

    return res.status(201).json({
        message:"applied succesully",
        application
    })  
})

const applicationViewController = asyncHandler(async(req,res)=>{
    const userId = req.user
    
    const check = await applicationModel.find({userId}).populate("jobId") 

    res.status(200).json({
        message:"all application",
        check
    })
})

const checkAppliedController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { jobId } = req.params;

  const alreadyApplied = await applicationModel.findOne({
    userId,
    jobId
  });

  res.status(200).json({
    applied: !!alreadyApplied
  });
});


module.exports = {
    applicationController,
    applicationViewController,
    checkAppliedController
}