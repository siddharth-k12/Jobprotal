const express = require("express");
const multer = require("multer");

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    analyzeJobMatch
} = require("../controllers/jobMatchController");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.post(
    "/job-match",
    authMiddleware,
    analyzeJobMatch
);

module.exports = router;