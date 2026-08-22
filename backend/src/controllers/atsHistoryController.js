const ATSAnalysis = require("../models/ATSAnalysis");
const Job = require("../models/job.models");
const Company = require("../models/company.models");


const getATSHistory = async (req, res) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const history = await ATSAnalysis
            .find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (error) {
        console.error(
            "Get ATS history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ATS history"
        });
    }
};


const getATSAnalysisById = async (req, res) => {
    try {
        const userId = req.user;
        const { analysisId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!analysisId) {
            return res.status(400).json({
                success: false,
                message: "Analysis ID is required"
            });
        }

        const analysis = await ATSAnalysis
            .findOne({
                _id: analysisId,
                userId
            })
            .populate({
                path: "jobId",
                select: "title description location jobType salaryRange companyId",
                populate: {
                    path: "companyId",
                    select: "companyName"
                }
            })
            .lean();

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "ATS analysis not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error(
            "Get ATS analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ATS analysis"
        });
    }
};

const deleteATSAnalysis = async (req, res) => {
    try {
        const userId = req.user;
        const { analysisId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!analysisId) {
            return res.status(400).json({
                success: false,
                message: "Analysis ID is required"
            });
        }

        const analysis = await ATSAnalysis.findOneAndDelete({
            _id: analysisId,
            userId
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "ATS analysis not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "ATS analysis deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete ATS analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete ATS analysis"
        });
    }
};
module.exports = {
    getATSHistory,
    getATSAnalysisById,
        deleteATSAnalysis

};