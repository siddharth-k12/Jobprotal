const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminPanel = require('../middlewares/adminPanel')
const { createJobController, jobUpdateController, jobDeleteController, allJobController, jobIdController, companyJobController, searchJobs } = require('../controllers/job.controller')
const route = express.Router()

//job routes all is complete

route.get('/',authMiddleware,allJobController)
route.get("/search", authMiddleware,searchJobs);
route.get('/:jobId',authMiddleware,jobIdController)
route.get('/company-job/:companyId',authMiddleware,adminPanel,companyJobController)
route.post('/create/:companyId',authMiddleware,adminPanel,createJobController)
route.patch('/update/:companyId/:jobId',authMiddleware,adminPanel,jobUpdateController)

route.delete('/delete/:companyId/:jobId',authMiddleware,adminPanel,jobDeleteController)





module.exports = route