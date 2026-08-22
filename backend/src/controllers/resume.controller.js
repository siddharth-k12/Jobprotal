const axios = require("axios");

const asyncHandler = require("../middlewares/asyncHandler");

const resumeModel =
  require("../models/resume.models");

const resumeAnalysisModel =
  require("../models/resumeAnalysis.models");

const cloudinary =
  require("../utils/cloudnaryConfig");

const extractPdfText =
  require("../services/resume/pdfTextExtractor");

const {
  cleanResumeText,
  getWordCount,
} = require("../services/resume/textCleaner");

const {
  detectSections,
  extractSections,
} = require("../services/resume/sectionParser");

const {
  extractSkills,
} = require("../services/resume/skillExtractor");

const {
  calculateAtsScore,
  generateSuggestions,
  getMissingSections,
} = require("../services/resume/atsScorer");

const mongoose = require("mongoose");

// =====================================================
// BUFFER TO DATA URI
// =====================================================

function bufferToDataUri(file) {
  const base64 = file.buffer.toString("base64");

  return `data:${file.mimetype};base64,${base64}`;
}

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResumeController = asyncHandler(
  async (req, res) => {
    const userId = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const file = req.file;

    // -----------------------------------------
    // Validate PDF
    // -----------------------------------------

    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      return res.status(400).json({
        success: false,
        message: "Only PDF resume files are allowed",
      });
    }

    // -----------------------------------------
    // 5 MB limit
    // -----------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume must be smaller than 5 MB",
      });
    }

    // -----------------------------------------
    // Upload to Cloudinary
    // -----------------------------------------

    const dataUri = bufferToDataUri(file);

    const result =
      await cloudinary.uploader.upload(dataUri, {
        folder: "jobportal/resumes",
        resource_type: "raw",
      });

    // -----------------------------------------
    // Save MongoDB document
    // -----------------------------------------

    const resume =
      await resumeModel.create({
        userId,

        fileName: file.originalname,

        fileUrl: result.secure_url,

        publicId: result.public_id,

        fileType: file.mimetype,

        fileSize: file.size,

        status: "uploaded",
      });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",

      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  }
);

// =====================================================
// GET USER RESUMES
// =====================================================

const getMyResumesController =
  asyncHandler(async (req, res) => {
    const userId = req.user;

    const resumes =
      await resumeModel
        .find({ userId })
        .select(
          "fileName fileUrl fileType fileSize status createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      resumes,
    });
  });

// =====================================================
// GET SINGLE RESUME
// =====================================================

const getResumeController =
  asyncHandler(async (req, res) => {
    const userId = req.user;
    const { resumeId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(resumeId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    const resume =
      await resumeModel
        .findOne({
          _id: resumeId,
          userId,
        })
        .lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  });

// =====================================================
// DELETE RESUME
// =====================================================

const deleteResumeController =
  asyncHandler(async (req, res) => {
    const userId = req.user;
    const { resumeId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(resumeId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    const resume =
      await resumeModel.findOne({
        _id: resumeId,
        userId,
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // -----------------------------------------
    // Delete Cloudinary file
    // -----------------------------------------

    await cloudinary.uploader.destroy(
      resume.publicId,
      {
        resource_type: "raw",
      }
    );

    // -----------------------------------------
    // Delete analysis
    // -----------------------------------------

    await resumeAnalysisModel.deleteOne({
      resumeId: resume._id,
      userId,
    });

    // -----------------------------------------
    // Delete MongoDB resume
    // -----------------------------------------

    await resumeModel.deleteOne({
      _id: resumeId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  });

// =====================================================
// ANALYZE RESUME ATS
// =====================================================

const analyzeResumeAtsController =
  asyncHandler(async (req, res) => {
    const userId = req.user;
    const { resumeId } = req.params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(resumeId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    // -----------------------------------------
    // Find user's resume
    // -----------------------------------------

    const resume =
      await resumeModel.findOne({
        _id: resumeId,
        userId,
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // -----------------------------------------
    // Check existing analysis
    // -----------------------------------------

    const existingAnalysis =
      await resumeAnalysisModel
        .findOne({
          resumeId,
          userId,
        })
        .lean();

    if (existingAnalysis) {
      return res.status(200).json({
        success: true,
        message: "Resume ATS analysis already exists",
        analysis: existingAnalysis,
      });
    }

    // -----------------------------------------
    // Set processing status
    // -----------------------------------------

    resume.status = "processing";
    await resume.save();

    try {
      // -----------------------------------------
      // Download PDF from Cloudinary
      // -----------------------------------------

      const pdfResponse =
        await axios.get(resume.fileUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
          maxContentLength:
            5 * 1024 * 1024,
        });

      const pdfBuffer =
        Buffer.from(pdfResponse.data);

      // -----------------------------------------
      // Extract PDF text
      // -----------------------------------------

      const extracted =
        await extractPdfText(pdfBuffer);

      let text = extracted.text;

      // -----------------------------------------
      // Clean text
      // -----------------------------------------

      text = cleanResumeText(text);

      if (!text || text.length < 50) {
        throw new Error(
          "Could not extract sufficient text from this PDF"
        );
      }

      // -----------------------------------------
      // Parse sections
      // -----------------------------------------

      const sections =
        detectSections(text);

      const parsedSections =
        extractSections(text);

      // -----------------------------------------
      // Extract skills
      // -----------------------------------------

      const skills =
        extractSkills(text);

      // -----------------------------------------
      // Word count
      // -----------------------------------------

      const wordCount =
        getWordCount(text);

      // -----------------------------------------
      // ATS score
      // -----------------------------------------

      const scoreResult =
        calculateAtsScore({
          sections,
          skills,
          wordCount,
          text,
        });

      // -----------------------------------------
      // Suggestions
      // -----------------------------------------

      const suggestions =
        generateSuggestions({
          sections,
          skills,
          wordCount,
        });

      // -----------------------------------------
      // Missing sections
      // -----------------------------------------

      const missingSections =
        getMissingSections(sections);

      // -----------------------------------------
      // Save extracted data to Resume
      // -----------------------------------------

      resume.extractedText = text;

      resume.parsedData = {
        pages: extracted.pages,

        sections: parsedSections,

        detectedSections: sections,

        skills,

        wordCount,
      };

      resume.status = "completed";

      await resume.save();

      // -----------------------------------------
      // Save ATS analysis
      // -----------------------------------------

      const analysis =
        await resumeAnalysisModel.create({
          resumeId: resume._id,

          userId,

          score: scoreResult.score,

          scoreBreakdown:
            scoreResult.breakdown,

          sections,

          skills,

          missingSections,

          suggestions,

          wordCount,

          extractedText: text,

          analyzedAt: new Date(),
        });

      // -----------------------------------------
      // Response
      // -----------------------------------------

      return res.status(200).json({
        success: true,

        message:
          "Resume ATS analysis completed",

        analysis: {
          id: analysis._id,

          resumeId: analysis.resumeId,

          score: analysis.score,

          scoreBreakdown:
            analysis.scoreBreakdown,

          sections: analysis.sections,

          skills: analysis.skills,

          missingSections:
            analysis.missingSections,

          suggestions:
            analysis.suggestions,

          wordCount:
            analysis.wordCount,

          analyzedAt:
            analysis.analyzedAt,
        },
      });
    } catch (error) {
      // -----------------------------------------
      // Mark processing as failed
      // -----------------------------------------

      resume.status = "failed";

      await resume.save();

      throw error;
    }
  });

// =====================================================
// GET ATS ANALYSIS
// =====================================================

const getResumeAtsController =
  asyncHandler(async (req, res) => {
    const userId = req.user;
    const { resumeId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(resumeId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    const analysis =
      await resumeAnalysisModel
        .findOne({
          resumeId,
          userId,
        })
        .lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "ATS analysis not found. Analyze the resume first.",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  });

module.exports = {
  uploadResumeController,
  getMyResumesController,
  getResumeController,
  deleteResumeController,
  analyzeResumeAtsController,
  getResumeAtsController,
};