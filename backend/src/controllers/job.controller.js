const jobModel = require("../models/job.models");
const asyncHandler = require("../middlewares/asyncHandler");
const companyModel = require("../models/company.models");

// Create job
const createJobController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { companyId } = req.params;

  const recruiterCompany = await companyModel.findOne({
    _id: companyId,
    createAt: userId,
  });

  if (!recruiterCompany) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a job for this company",
    });
  }

  const {
    title,
    description,
    requirement,
    jobType,
    workMode,
    location,
    exprienceLevel,
    salaryRange,
    statusNow,
  } = req.body;

  if (!title || !description || !location || !salaryRange) {
    return res.status(400).json({
      success: false,
      message: "Required job fields are missing",
    });
  }

  if (
    !Array.isArray(requirement) ||
    requirement.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Requirement must contain at least one item",
    });
  }

  const jobForm = await jobModel.create({
    companyId,
    recuriterId: userId,
    title: title.trim(),
    description: description.trim(),
    requirement,
    jobType,
    workMode,
    location: location.trim(),
    exprienceLevel,
    salaryRange,
    statusNow,
  });

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    jobForm,
  });
});

// Update job
const jobUpdateController = asyncHandler(async (req, res) => {
  const { jobId, companyId } = req.params;
  const userId = req.user;

  const {
    title,
    description,
    requirement,
    jobType,
    workMode,
    location,
    exprienceLevel,
    salaryRange,
    statusNow,
  } = req.body;

  const setData = {};

  if (title !== undefined) setData.title = title.trim();
  if (description !== undefined) setData.description = description.trim();

  if (requirement !== undefined) {
    if (!Array.isArray(requirement) || requirement.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Requirement must be a non-empty array",
      });
    }

    setData.requirement = requirement;
  }

  if (jobType !== undefined) setData.jobType = jobType;
  if (workMode !== undefined) setData.workMode = workMode;
  if (location !== undefined) setData.location = location.trim();
  if (exprienceLevel !== undefined) {
    setData.exprienceLevel = exprienceLevel;
  }
  if (salaryRange !== undefined) {
    setData.salaryRange = salaryRange.trim();
  }
  if (statusNow !== undefined) setData.statusNow = statusNow;

  if (Object.keys(setData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update",
    });
  }

  // IMPORTANT: ownership check
  const profile = await jobModel.findOneAndUpdate(
    {
      _id: jobId,
      companyId,
      recuriterId: userId,
    },
    { $set: setData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Job not found or you are not authorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Job updated successfully",
    profile,
  });
});

// Delete job
const jobDeleteController = asyncHandler(async (req, res) => {
  const { companyId, jobId } = req.params;
  const userId = req.user;

  const deletedJob = await jobModel.findOneAndDelete({
    _id: jobId,
    companyId,
    recuriterId: userId,
  });

  if (!deletedJob) {
    return res.status(404).json({
      success: false,
      message: "Job not found or you are not authorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

// Get all jobs
const allJobController = asyncHandler(async (req, res) => {
  const jobs = await jobModel
    .find()
    .populate("companyId", "companyName")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "All jobs",
    jobs,
  });
});

// Get job by ID
const jobIdController = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await jobModel
    .findById(jobId)
    .populate("companyId", "companyName website industry location")
    .lean();

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Job found",
    job,
  });
});

// Recruiter's jobs for a company
const companyJobController = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user;

  const companyJob = await jobModel
    .find({
      recuriterId: userId,
      companyId,
    })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "All company jobs",
    companyJob,
  });
});

// Search jobs
const searchJobs = asyncHandler(async (req, res) => {
  const { keyword, location } = req.query;

  const filter = {};

  if (keyword?.trim()) {
    filter.title = {
      $regex: keyword.trim(),
      $options: "i",
    };
  }

  if (location?.trim()) {
    filter.location = {
      $regex: location.trim(),
      $options: "i",
    };
  }

  const jobs = await jobModel
    .find(filter)
    .populate("companyId", "companyName")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    jobs,
  });
});

module.exports = {
  createJobController,
  jobUpdateController,
  jobDeleteController,
  allJobController,
  jobIdController,
  companyJobController,
  searchJobs,
};