const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resume",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    scoreBreakdown: {
      contact: {
        type: Number,
        default: 0,
      },

      summary: {
        type: Number,
        default: 0,
      },

      skills: {
        type: Number,
        default: 0,
      },

      experience: {
        type: Number,
        default: 0,
      },

      education: {
        type: Number,
        default: 0,
      },

      projects: {
        type: Number,
        default: 0,
      },

      formatting: {
        type: Number,
        default: 0,
      },
    },

    sections: {
      contact: {
        type: Boolean,
        default: false,
      },

      summary: {
        type: Boolean,
        default: false,
      },

      skills: {
        type: Boolean,
        default: false,
      },

      experience: {
        type: Boolean,
        default: false,
      },

      education: {
        type: Boolean,
        default: false,
      },

      projects: {
        type: Boolean,
        default: false,
      },
    },

    skills: {
      type: [String],
      default: [],
    },

    missingSections: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    extractedText: {
      type: String,
      default: null,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One analysis per resume for now.
// Later we can change this when job-specific ATS analysis is added.
resumeAnalysisSchema.index(
  {
    resumeId: 1,
  },
  {
    unique: true,
  }
);

const ResumeAnalysis = mongoose.model(
  "resumeAnalysis",
  resumeAnalysisSchema
);

module.exports = ResumeAnalysis;