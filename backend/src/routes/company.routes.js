const express = require("express");
const route = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const adminPanel = require('../middlewares/adminPanel');
const { createCompanyController, allComapanyController, companyUpdateController, companyDelete, companyViewController } = require("../controllers/company.controller");

//update and delete option remain

route.get("/all-company",authMiddleware,adminPanel,allComapanyController)
route.get('/:companyId',authMiddleware,adminPanel,companyViewController)
route.post("/",authMiddleware,adminPanel,createCompanyController)

route.patch("/update/:companyId",authMiddleware,adminPanel,companyUpdateController)
route.delete('/delete/:companyId',authMiddleware,adminPanel,companyDelete)

module.exports = route;