const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    requirement: [
      {
        type: String,
        trim: true,
      },
    ],

    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time"],
      default: "Full-time",
    },

    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Onsite",
    },

    location: {
      type: String,
      trim: true,
    },

    experienceLevel: {
      type: String,
      trim: true,
    },

    salaryRange: {
      type: String,
      trim: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Recruiter dashboard
jobSchema.index({
  recruiterId: 1,
  createdAt: -1,
});

// Company → jobs
jobSchema.index({
  companyId: 1,
  createdAt: -1,
});

// Job listing/filtering
jobSchema.index({
  status: 1,
  createdAt: -1,
});

// Location-based filtering
jobSchema.index({
  location: 1,
  status: 1,
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;