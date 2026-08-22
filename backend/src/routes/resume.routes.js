const express = require("express");

const {
  uploadResumeController,
  getMyResumesController,
  getResumeController,
  deleteResumeController,
  analyzeResumeAtsController,
  getResumeAtsController,
} = require("../controllers/resume.controller");

const authMiddleware =
  require("../middlewares/authMiddleware");

const resumeUpload =
  require("../middlewares/resumeUpload");

const router = express.Router();

// =====================================================
// UPLOAD RESUME
// =====================================================

router.post(
  "/upload",
  authMiddleware,
  resumeUpload.single("resume"),
  uploadResumeController
);

// =====================================================
// GET MY RESUMES
// =====================================================

router.get(
  "/",
  authMiddleware,
  getMyResumesController
);

// =====================================================
// ANALYZE RESUME ATS
// =====================================================

router.post(
  "/:resumeId/ats",
  authMiddleware,
  analyzeResumeAtsController
);

// =====================================================
// GET ATS RESULT
// =====================================================

router.get(
  "/:resumeId/ats",
  authMiddleware,
  getResumeAtsController
);

// =====================================================
// GET SINGLE RESUME
// =====================================================

router.get(
  "/:resumeId",
  authMiddleware,
  getResumeController
);

// =====================================================
// DELETE RESUME
// =====================================================

router.delete(
  "/:resumeId",
  authMiddleware,
  deleteResumeController
);

module.exports = router;