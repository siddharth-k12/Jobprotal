const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "completed",
        "failed",
      ],
      default: "uploaded",
    },

    extractedText: {
      type: String,
      default: null,
    },

    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({
  userId: 1,
  createdAt: -1,
});

const Resume = mongoose.model(
  "resume",
  resumeSchema
);

module.exports = Resume;