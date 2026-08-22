const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const {
  applicationController,
  applicationViewController,
  checkAppliedController,
  getApplicationByIdController,
} = require("../controllers/application.controller");

const routes = express.Router();

const upload = require("../utils/multer");

routes.post(
  "/:jobId",
  authMiddleware,
  upload.single("resume"),
  applicationController
);

routes.get(
  "/",
  authMiddleware,
  applicationViewController
);

routes.get(
  "/check/:jobId",
  authMiddleware,
  checkAppliedController
);

routes.get(
  "/:applicationId",
  authMiddleware,
  getApplicationByIdController
);

module.exports = routes;