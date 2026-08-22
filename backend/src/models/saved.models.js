const mongoose = require("mongoose");

const savedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

savedSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

savedSchema.index({
  userId: 1,
  savedAt: -1,
});

const Saved = mongoose.model("saved", savedSchema);

module.exports = Saved;