const express = require("express");
const multer = require("multer");

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    analyzeResume
} = require("../controllers/atsController");

const {
    analyzeJobMatch
} = require("../controllers/jobMatchController");

const {
    getATSHistory,
    getATSAnalysisById,
    deleteATSAnalysis
} = require("../controllers/atsHistoryController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


// =====================================================
// RESUME ATS ANALYZER
// PDF ONLY
// =====================================================

router.post(
    "/analyze",
    authMiddleware,
    upload.single("resume"),
    analyzeResume
);


// =====================================================
// AI JOB MATCHER
// KEEP SEPARATE
// =====================================================

router.post(
    "/job-match",
    authMiddleware,
    upload.single("resume"),
    analyzeJobMatch
);


// =====================================================
// ATS HISTORY
// =====================================================

router.get(
    "/history",
    authMiddleware,
    getATSHistory
);


// =====================================================
// SINGLE ATS ANALYSIS
// =====================================================

router.get(
    "/history/:analysisId",
    authMiddleware,
    getATSAnalysisById
);


// =====================================================
// DELETE ATS ANALYSIS
// =====================================================

router.delete(
    "/history/:analysisId",
    authMiddleware,
    deleteATSAnalysis
);


module.exports = router;