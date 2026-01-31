const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { candidateProfileController, candidateEducationController, candidateExpreienceController, candidateProfileEditController, candidateEducationEditController, candidateExpreienceEditController, getCandidateController } = require('../controllers/candidate.controller');
const routes = express.Router();

routes.get('/',authMiddleware,getCandidateController)

routes.post("/profile",authMiddleware,candidateProfileController)
routes.post("/profile-education",authMiddleware,candidateEducationController);
routes.post("/profile-expreience",authMiddleware,candidateExpreienceController)

routes.patch("/profile-edit",authMiddleware,candidateProfileEditController)
routes.patch("/profile-edit-education/:educationId",authMiddleware,candidateEducationEditController)
routes.patch("/profile-edit-experience/:experienceId",authMiddleware,candidateExpreienceEditController)


module.exports = routes