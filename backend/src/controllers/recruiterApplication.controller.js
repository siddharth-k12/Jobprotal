const asyncHandler = require("../middlewares/asyncHandler");

const applicationModel = require("../models/application.models");
const jobModel = require("../models/job.models");

// =====================================================
// GET JOB APPLICANTS
// =====================================================

const getJobApplicantsController = asyncHandler(
  async (req, res) => {
    const recruiterId = req.user;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // -----------------------------------------
    // Verify recruiter owns the job
    // -----------------------------------------

    const job = await jobModel
      .findOne({
        _id: jobId,
        recruiterId,
      })
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    // -----------------------------------------
    // Get applications
    // -----------------------------------------

    const applications = await applicationModel
      .find({ jobId })
      .populate(
        "userId",
        "name email"
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
      count: applications.length,
      job: {
        id: job._id,
        title: job.title,
      },
      applications,
    });
  }
);

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatusController = asyncHandler(
  async (req, res) => {
    const recruiterId = req.user;

    const { applicationId } = req.params;
    const { status } = req.body;

    // -----------------------------------------
    // Validate application ID
    // -----------------------------------------

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    // -----------------------------------------
    // Validate status
    // -----------------------------------------

    const allowedStatuses = [
      "shortlist",
      "rejected",
      "hired",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed: shortlist, rejected, hired",
      });
    }

    // -----------------------------------------
    // Find application
    // -----------------------------------------

    const application =
      await applicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // -----------------------------------------
    // Verify recruiter owns the job
    // -----------------------------------------

    const job = await jobModel.findOne({
      _id: application.jobId,
      recruiterId,
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this application",
      });
    }

    // -----------------------------------------
    // Update status
    // -----------------------------------------

    application.statusNow = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: {
        id: application._id,
        status: application.statusNow,
        jobId: application.jobId,
        userId: application.userId,
        resumeId: application.resumeId,
        updatedAt: application.updatedAt,
      },
    });
  }
);

module.exports = {
  getJobApplicantsController,
  updateApplicationStatusController,
};