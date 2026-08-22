const express = require('express');
const { registerHandler, loginController, updateController, passwordController, logoutUser, userAdminController, currenctUserController } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware')
const {registerUserSchema,loginUserSchema} = require('../validations/userValidation.js')
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");
const routes = express.Router();

routes.post('/register',authLimiter,validate(registerUserSchema),registerHandler)
routes.post('/login',  authLimiter,validate(loginUserSchema),loginController)
routes.patch('/update',authLimiter,authMiddleware,updateController)
routes.patch('/password',authLimiter,authMiddleware,passwordController)
routes.post('/logout',authMiddleware,logoutUser)
routes.get('/role',authMiddleware,userAdminController)
routes.get('/',authMiddleware,currenctUserController)

module.exports = routes