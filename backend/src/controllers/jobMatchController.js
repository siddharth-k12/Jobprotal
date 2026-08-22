const axios = require("axios");
const FormData = require("form-data");
const mongoose = require("mongoose");

const Job = require("../models/job.models");
const Resume = require("../models/resume.models");
const ATSAnalysis = require("../models/ATSAnalysis");

const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL ||
    "https://nexthire-ai-service.onrender.com";


// =====================================================
// ANALYZE RESUME AGAINST JOB DESCRIPTION
// =====================================================

const analyzeJobMatch = async (req, res) => {

    try {

        console.log("\n=================================");
        console.log("       AI JOB MATCH START");
        console.log("=================================");


        // =================================================
        // AUTH
        // =================================================

        const userId = req.user;

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        console.log("User ID:", userId);


        // =================================================
        // REQUEST DATA
        // =================================================

        const {
            resumeId,
            jobId
        } = req.body || {};


        console.log("Resume ID:", resumeId);
        console.log("Job ID:", jobId);


        if (!resumeId) {

            return res.status(400).json({
                success: false,
                message: "resumeId is required"
            });

        }


        if (!jobId) {

            return res.status(400).json({
                success: false,
                message: "jobId is required"
            });

        }


        // =================================================
        // VALIDATE IDS
        // =================================================

        if (
            !mongoose.Types.ObjectId.isValid(resumeId)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid resumeId"
            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(jobId)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid jobId"
            });

        }


        // =================================================
        // FIND RESUME
        // =================================================

        const resume =
            await Resume.findOne({
                _id: resumeId,
                userId
            }).lean();


        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });

        }


        console.log(
            "Resume:",
            resume.fileName
        );


        // =================================================
        // VALIDATE RESUME
        // =================================================

        if (!resume.fileUrl) {

            return res.status(400).json({
                success: false,
                message: "Resume file URL is missing"
            });

        }


        if (
            resume.fileType &&
            resume.fileType !== "application/pdf"
        ) {

            return res.status(400).json({
                success: false,
                message: "Only PDF resumes are supported"
            });

        }


        // =================================================
        // FIND JOB
        // =================================================

        const job =
            await Job.findById(jobId).lean();


        if (!job) {

            return res.status(404).json({
                success: false,
                message: "Job not found"
            });

        }


        console.log(
            "Job:",
            job.title
        );


        // =================================================
        // VALIDATE JOB DESCRIPTION
        // =================================================

        if (
            !job.description ||
            !job.description.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Job description is not available"
            });

        }


        // =================================================
        // DOWNLOAD RESUME
        // =================================================

        console.log(
            "Downloading resume..."
        );


        const resumeResponse =
            await axios.get(
                resume.fileUrl,
                {
                    responseType: "arraybuffer",

                    timeout: 30000,

                    maxContentLength:
                        10 * 1024 * 1024,

                    maxBodyLength:
                        10 * 1024 * 1024
                }
            );


        const resumeBuffer =
            Buffer.from(
                resumeResponse.data
            );


        if (!resumeBuffer.length) {

            return res.status(400).json({
                success: false,
                message: "Resume file is empty"
            });

        }


        console.log(
            "Resume downloaded:",
            resumeBuffer.length,
            "bytes"
        );


        // =================================================
        // CREATE MULTIPART FORM
        // =================================================

        const formData =
            new FormData();


        formData.append(
            "file",
            resumeBuffer,
            {
                filename:
                    resume.fileName ||
                    "resume.pdf",

                contentType:
                    "application/pdf"
            }
        );


        formData.append(
            "job_description",
            job.description
        );


        // =================================================
        // CALL DEDICATED JD MATCH AI ENDPOINT
        // =================================================
        //
        // IMPORTANT:
        //
        // /ats/analyze-pdf
        // is ONLY for:
        //
        // Resume PDF -> Resume ATS score
        //
        // It must NOT be used here.
        //
        // JD matching uses the matching service.
        //
        // =================================================

        const AI_MATCH_ENDPOINT =
            `${AI_SERVICE_URL}/matching/analyze`;


        console.log(
            "Calling AI Match:",
            AI_MATCH_ENDPOINT
        );


        const aiResponse =
            await axios.post(
                AI_MATCH_ENDPOINT,
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    },

                    maxContentLength:
                        10 * 1024 * 1024,

                    maxBodyLength:
                        10 * 1024 * 1024,

                    timeout: 120000
                }
            );


        console.log(
            "AI Match status:",
            aiResponse.status
        );


        // =================================================
        // NORMALIZE RESPONSE
        // =================================================

        const rawResponse =
            aiResponse.data;


        const analysisData =
            rawResponse?.data ||
            rawResponse;


        if (!analysisData) {

            return res.status(502).json({
                success: false,
                message:
                    "AI service returned empty response"
            });

        }


        console.log(
            "AI Match response:",
            JSON.stringify(
                analysisData,
                null,
                2
            )
        );


        // =================================================
        // NORMALIZE SCORE
        // =================================================

        const originalScore =
            analysisData.score || {};


        const normalizedScore = {

            ...originalScore,

            final_score:
                originalScore.final_score ??
                originalScore.finalScore ??
                analysisData.final_score ??
                analysisData.finalScore ??
                0,

            skill_score:
                originalScore.skill_score ??
                originalScore.skillScore ??
                analysisData.skill_score ??
                analysisData.skillScore ??
                0,

            project_score:
                originalScore.project_score ??
                originalScore.projectScore ??
                analysisData.project_score ??
                analysisData.projectScore ??
                0,

            experience_score:
                originalScore.experience_score ??
                originalScore.experienceScore ??
                analysisData.experience_score ??
                analysisData.experienceScore ??
                0

        };


        // =================================================
        // NORMALIZE MATCH DATA
        // =================================================

        const matchedSkills =
            analysisData.matched_skills ??
            analysisData.matchedSkills ??
            [];


        const semanticMatches =
            analysisData.semantic_matches ??
            analysisData.semanticMatches ??
            [];


        const missingSkills =
            analysisData.missing_skills ??
            analysisData.missingSkills ??
            [];


        const projectRelevance =
            analysisData.project_relevance ??
            analysisData.projectRelevance ??
            [];


        const experienceRelevance =
            analysisData.experience_relevance ??
            analysisData.experienceRelevance ??
            [];


        const strengths =
            analysisData.strengths ??
            [];


        const suggestions =
            analysisData.suggestions ??
            [];


        // =================================================
        // FINAL NORMALIZED RESULT
        // =================================================

        const normalizedAnalysis = {

            ...analysisData,

            score:
                normalizedScore,

            matched_skills:
                matchedSkills,

            semantic_matches:
                semanticMatches,

            missing_skills:
                missingSkills,

            project_relevance:
                projectRelevance,

            experience_relevance:
                experienceRelevance,

            strengths,

            suggestions

        };


        // =================================================
        // SAVE ANALYSIS
        // =================================================

        const savedAnalysis =
            await ATSAnalysis.create({

                userId,

                jobId,

                resumeId,

                resumeFileName:
                    resume.fileName ||
                    "resume.pdf",

                score:
                    normalizedScore,

                matchedSkills:
                    matchedSkills,

                semanticMatches:
                    semanticMatches,

                missingSkills:
                    missingSkills,

                projectRelevance:
                    projectRelevance,

                experienceRelevance:
                    experienceRelevance,

                strengths:
                    strengths,

                suggestions:
                    suggestions

            });


        console.log(
            "ATS Analysis saved:",
            savedAnalysis._id
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            cached: false,

            analysisId:
                savedAnalysis._id,

            data:
                normalizedAnalysis

        });


    } catch (error) {

        console.error(
            "\n================================="
        );

        console.error(
            "       AI JOB MATCH ERROR"
        );

        console.error(
            "================================="
        );


        console.error(
            "Name:",
            error.name
        );


        console.error(
            "Message:",
            error.message
        );


        console.error(
            "Code:",
            error.code
        );


        // =================================================
        // AI SERVICE ERROR
        // =================================================

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
                    "AI matching service failed"

            });

        }


        // =================================================
        // AI SERVICE NOT RUNNING
        // =================================================

        if (
            error.code ===
            "ECONNREFUSED"
        ) {

            return res.status(502).json({

                success: false,

                message:
                    "AI matching service is not running"

            });

        }


        // =================================================
        // TIMEOUT
        // =================================================

        if (
            error.code ===
            "ECONNABORTED"
        ) {

            return res.status(504).json({

                success: false,

                message:
                    "AI job matching timed out"

            });

        }


        // =================================================
        // MONGODB VALIDATION ERROR
        // =================================================

        if (
            error.name ===
            "ValidationError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ATS analysis data",

                errors:
                    error.errors

            });

        }


        // =================================================
        // GENERAL ERROR
        // =================================================

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to analyze job match"

        });

    }

};


module.exports = {
    analyzeJobMatch
};