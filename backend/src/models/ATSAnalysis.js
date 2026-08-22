const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema(
    {
        // =====================================================
        // USER
        // =====================================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        },


        // =====================================================
        // JOB
        // =====================================================

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true
        },


        // =====================================================
        // RESUME
        // =====================================================

        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "resume",
            default: null,
            index: true
        },


        // =====================================================
        // RESUME FILE NAME
        // =====================================================

        resumeFileName: {
            type: String,
            default: ""
        },


        // =====================================================
        // ATS SCORE
        // =====================================================

        score: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },


        // =====================================================
        // MATCHED SKILLS
        // =====================================================

        matchedSkills: {
            type: [String],
            default: []
        },


        // =====================================================
        // SEMANTIC MATCHES
        // =====================================================

        semanticMatches: {
            type: [String],
            default: []
        },


        // =====================================================
        // MISSING SKILLS
        // =====================================================

        missingSkills: {
            type: [String],
            default: []
        },


        // =====================================================
        // PROJECT RELEVANCE
        // Can contain objects like:
        //
        // {
        //     project: "AI Job Portal",
        //     score: 64.7
        // }
        // =====================================================

        projectRelevance: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },


        // =====================================================
        // EXPERIENCE RELEVANCE
        // Can contain structured objects
        // =====================================================

        experienceRelevance: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },


        // =====================================================
        // STRENGTHS
        // =====================================================

        strengths: {
            type: [String],
            default: []
        },


        // =====================================================
        // SUGGESTIONS
        // =====================================================

        suggestions: {
            type: [String],
            default: []
        }
    },


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    {
        timestamps: true
    }
);


// =========================================================
// HISTORY INDEX
// =========================================================

atsAnalysisSchema.index({
    userId: 1,
    createdAt: -1
});


// =========================================================
// USER + JOB HISTORY INDEX
// =========================================================

atsAnalysisSchema.index({
    userId: 1,
    jobId: 1,
    createdAt: -1
});


// =========================================================
// MODEL
// =========================================================

module.exports = mongoose.model(
    "ATSAnalysis",
    atsAnalysisSchema
);