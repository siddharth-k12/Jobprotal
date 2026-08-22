const saveModel = require("../models/saved.models");
const asyncHandler = require("../middlewares/asyncHandler");

const savedController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { jobId } = req.params;

  const existingSavedJob = await saveModel.findOne({
    userId,
    jobId,
  });

  if (existingSavedJob) {
    return res.status(409).json({
      success: false,
      message: "Job is already saved",
    });
  }

  const job = await saveModel.create({
    userId,
    jobId,
  });

  return res.status(201).json({
    success: true,
    message: "Job saved successfully",
    job,
  });
});

const allSavedJobController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const savedJob = await saveModel
    .find({ userId })
    .populate("jobId")
    .sort({ saveAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "All saved jobs",
    savedJob,
  });
});

const deleteSavedController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { jobId } = req.params;

  const saved = await saveModel.findOneAndDelete({
    userId,
    jobId,
  });

  if (!saved) {
    return res.status(404).json({
      success: false,
      message: "Saved job not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Job removed from saved list",
  });
});

const checkSavedController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { jobId } = req.params;

  const saved = await saveModel.exists({
    userId,
    jobId,
  });

  return res.status(200).json({
    success: true,
    saved: Boolean(saved),
  });
});

module.exports = {
  savedController,
  allSavedJobController,
  deleteSavedController,
  checkSavedController,
};