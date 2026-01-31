const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { savedController, allSavedJobController, deleteSavedController, checkSavedController } = require('../controllers/saved.controller')
const routes = express.Router()


routes.get('/',authMiddleware,allSavedJobController)
routes.get('/check/:jobId',authMiddleware,checkSavedController)
routes.post('/create/:jobId',authMiddleware,savedController)
routes.delete('/delete/:jobId',authMiddleware,deleteSavedController)

module.exports = routes;