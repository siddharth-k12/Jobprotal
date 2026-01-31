const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,

});

module.exports = upload;
