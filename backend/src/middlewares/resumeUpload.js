const multer = require("multer");

const storage = multer.memoryStorage();

const isPdfBuffer = (buffer) => {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  return buffer.subarray(0, 4).toString() === "%PDF";
};

const fileFilter = (req, file, cb) => {
  const isPdfExtension =
    file.originalname.toLowerCase().endsWith(".pdf");

  const isAllowedMime =
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/octet-stream";

  if (!isPdfExtension || !isAllowedMime) {
    return cb(
      new Error("Only PDF resume files are allowed"),
      false
    );
  }

  cb(null, true);
};

const resumeUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = resumeUpload;