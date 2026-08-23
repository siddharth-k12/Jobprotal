const asyncHandler = require("../middlewares/asyncHandler");

const applicationModel =
  require("../models/application.models");

const resumeModel =
  require("../models/resume.models");

const jobModel =
  require("../models/job.models");

const cloudinary =
  require("../utils/cloudnaryConfig");


// =====================================================
// BUFFER → DATA URI
// =====================================================

function bufferToDataUri(file) {
  const base64 =
    file.buffer.toString("base64");

  return `data:${file.mimetype};base64,${base64}`;
}


// =====================================================
// APPLY FOR JOB
// =====================================================

const applicationController =
  asyncHandler(async (req, res) => {

    const userId = req.user;
    const { jobId } = req.params;
    const { resumeId } = req.body;


    // -----------------------------------------
    // Validate job ID
    // -----------------------------------------

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }


    // -----------------------------------------
    // Find job
    // -----------------------------------------

    const job =
      await jobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    // -----------------------------------------
    // Check job status
    // -----------------------------------------

    if (job.statusNow === "closed") {
      return res.status(400).json({
        success: false,
        message:
          "Applications for this job are closed",
      });
    }


    // -----------------------------------------
    // Check duplicate application
    // -----------------------------------------

    const alreadyApplied =
      await applicationModel.findOne({
        jobId,
        userId,
      });

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this job",
      });
    }


    let selectedResume;


    // =================================================
    // EXISTING RESUME
    // =================================================

    if (resumeId) {

      selectedResume =
        await resumeModel.findOne({
          _id: resumeId,
          userId,
        });

      if (!selectedResume) {
        return res.status(404).json({
          success: false,
          message:
            "Selected resume was not found",
        });
      }
    }


    // =================================================
    // NEW RESUME
    // =================================================

    else if (req.file) {

      const file = req.file;


      const isPdf =
        file.mimetype === "application/pdf" ||
        file.originalname
          .toLowerCase()
          .endsWith(".pdf");


      if (!isPdf) {
        return res.status(400).json({
          success: false,
          message:
            "Only PDF resume files are allowed",
        });
      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Resume must be smaller than 5 MB",
        });
      }


      const dataUri =
        bufferToDataUri(file);


      const result =
        await cloudinary.uploader.upload(
          dataUri,
          {
            folder:
              "jobportal/resumes",

            resource_type:
              "raw",
          }
        );


      selectedResume =
        await resumeModel.create({

          userId,

          fileName:
            file.originalname,

          fileUrl:
            result.secure_url,

          publicId:
            result.public_id,

          fileType:
            file.mimetype,

          fileSize:
            file.size,

          status:
            "uploaded",
        });
    }


    // =================================================
    // NO RESUME
    // =================================================

    else {

      return res.status(400).json({
        success: false,

        code:
          "RESUME_REQUIRED",

        message:
          "Please select or upload a resume",
      });
    }


    // =================================================
    // CREATE APPLICATION
    // =================================================

    const application =
      await applicationModel.create({

        jobId,

        userId,

        resumeId:
          selectedResume._id,

        statusNow:
          "applied",

        appliedAt:
          new Date(),
      });


    // =================================================
    // RETURN APPLICATION
    // =================================================

    const populatedApplication =
      await applicationModel
        .findById(
          application._id
        )
        .populate(
          "jobId",
          "title location jobType workMode salaryRange statusNow companyId"
        )
        .populate(
          "resumeId",
          "fileName fileUrl fileType fileSize status"
        )
        .lean();


    return res.status(201).json({

      success: true,

      message:
        "Application submitted successfully",

      application:
        populatedApplication,
    });
  });


// =====================================================
// GET MY APPLICATIONS
// =====================================================

const applicationViewController =
  asyncHandler(async (req, res) => {

    const userId = req.user;


    const applications =
      await applicationModel
        .find({
          userId,
        })
        .populate(
          "jobId",
          "title description location jobType workMode salaryRange statusNow companyId"
        )
        .populate(
          "resumeId",
          "fileName fileUrl fileType fileSize status createdAt"
        )
        .sort({
          appliedAt: -1,
        })
        .lean();


    return res.status(200).json({

      success: true,

      count:
        applications.length,

      applications,
    });
  });


// =====================================================
// CHECK APPLIED
// =====================================================

const checkAppliedController =
  asyncHandler(async (req, res) => {

    const userId = req.user;

    const { jobId } =
      req.params;


    if (!jobId) {
      return res.status(400).json({
        success: false,
        message:
          "Job ID is required",
      });
    }


    const application =
      await applicationModel.findOne({
        userId,
        jobId,
      });


    return res.status(200).json({

      success: true,

      applied:
        Boolean(application),
    });
  });


// =====================================================
// GET SINGLE APPLICATION
// =====================================================

const getApplicationByIdController =
  asyncHandler(async (req, res) => {

    const userId = req.user;

    const {
      applicationId,
    } = req.params;


    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message:
          "Application ID is required",
      });
    }


    const application =
      await applicationModel
        .findOne({
          _id: applicationId,
          userId,
        })
        .populate(
          "jobId",
          "title description location jobType workMode salaryRange statusNow companyId"
        )
        .populate(
          "resumeId",
          "fileName fileUrl fileType fileSize status createdAt"
        )
        .lean();


    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }


    return res.status(200).json({

      success: true,

      application,
    });
  });


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  applicationController,

  applicationViewController,

  checkAppliedController,

  getApplicationByIdController,
};