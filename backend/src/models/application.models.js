const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resume",
      required: true,
    },

    statusNow: {
      type: String,
      enum: [
        "applied",
        "shortlist",
        "rejected",
        "hired",
      ],
      default: "applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    jobId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

const applicationModel = mongoose.model(
  "application",
  applicationSchema
);

module.exports = applicationModel;