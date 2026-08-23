const express = require("express");

const authMiddleware =
  require("../middlewares/authMiddleware");

const {
  applicationController,
  applicationViewController,
  checkAppliedController,
  getApplicationByIdController,
} = require("../controllers/application.controller");

const upload =
  require("../utils/multer");

const routes =
  express.Router();


// APPLY
routes.post(
  "/:jobId",
  authMiddleware,
  upload.single("resume"),
  applicationController
);


// MY APPLICATIONS
routes.get(
  "/",
  authMiddleware,
  applicationViewController
);


// CHECK APPLICATION
routes.get(
  "/check/:jobId",
  authMiddleware,
  checkAppliedController
);


// SINGLE APPLICATION
routes.get(
  "/:applicationId",
  authMiddleware,
  getApplicationByIdController
);


module.exports = routes;