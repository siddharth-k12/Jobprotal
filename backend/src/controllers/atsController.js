const {
    analyzeResumeWithAI
} = require("../services/aiService");


const analyzeResume = async (req, res) => {

    try {

        console.log(
            "========== RESUME ATS ANALYZER =========="
        );

        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // ------------------------------------------
        // FILE REQUIRED
        // ------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        console.log("Resume:", {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        });

        // ------------------------------------------
        // PDF VALIDATION
        // ------------------------------------------

        const isPdf =
            req.file.mimetype === "application/pdf" &&
            req.file.buffer &&
            req.file.buffer.length >= 5 &&
            req.file.buffer
                .subarray(0, 5)
                .toString() === "%PDF-";

        if (!isPdf) {
            return res.status(400).json({
                success: false,
                message: "Only valid PDF resumes are allowed"
            });
        }

        // ------------------------------------------
        // AI SERVICE
        // ------------------------------------------

        const result =
            await analyzeResumeWithAI(
                req.file.buffer,
                req.file.originalname
            );

        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        return res.status(200).json({
            success: true,
            data: result.data || result
        });

    } catch (error) {

        console.error(
            "Resume ATS error:",
            error
        );

        // AI service response
        if (error.response) {

            console.error(
                "AI status:",
                error.response.status
            );

            console.error(
                "AI response:",
                error.response.data
            );

            return res.status(
                error.response.status >= 400 &&
                error.response.status < 500
                    ? error.response.status
                    : 502
            ).json({
                success: false,
                message:
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    "AI service failed"
            });
        }

        // Timeout
        if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {
            return res.status(504).json({
                success: false,
                message: "Resume ATS analysis timed out"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Resume ATS analysis failed"
        });
    }
};


module.exports = {
    analyzeResume
};