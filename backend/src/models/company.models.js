const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    website: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
      uppercase: true,
    },

    size: {
      type: String,
      enum: ["1-10", "10-20", "20-25", "25-100", "100+"],
      default: "1-10",
    },

    location: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({
  companyName: 1,
});

const Company = mongoose.model("company", companySchema);

module.exports = Company;