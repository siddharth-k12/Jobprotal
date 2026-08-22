const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },

    collogeName: {
      type: String,
      required: true,
      trim: true,
    },

    startYear: {
      type: Number,
      required: true,
      min: 1900,
    },

    endYear: {
      type: Number,
      required: true,
      min: 1900,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    jobRole: {
      type: String,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    employeeType: {
      type: String,
      enum: ["full-time", "intern", "part-time"],
      default: "full-time",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    location: {
      type: String,
      trim: true,
    },

    education: [educationSchema],

    experience: [experienceSchema],
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model(
  "candidate",
  candidateProfileSchema
);

module.exports = Candidate;