const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for common user queries
userSchema.index({ role: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);

module.exports = User;