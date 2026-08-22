const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getJobApplicantsController,
  updateApplicationStatusController,
} = require("../controllers/recruiterApplication.controller");

const router = express.Router();

// ==========================================
// GET ALL APPLICANTS FOR A JOB
// ==========================================

router.get(
  "/job/:jobId",
  authMiddleware,
  getJobApplicantsController
);

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

router.patch(
  "/application/:applicationId/status",
  authMiddleware,
  updateApplicationStatusController
);

module.exports = router;