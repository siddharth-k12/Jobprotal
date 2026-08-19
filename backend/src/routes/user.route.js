const express = require('express');
const { registerHandler, loginController, updateController, passwordController, logoutUser, userAdminController, currenctUserController } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware')
const {registerUserSchema,loginUserSchema} = require('../validations/userValidation.js')
const validate = require("../middlewares/validate");

const routes = express.Router();

routes.post('/register',validate(registerUserSchema),registerHandler)
routes.post('/login',validate(loginUserSchema),loginController)
routes.patch('/update',authMiddleware,updateController)
routes.patch('/password',authMiddleware,passwordController)
routes.post('/logout',authMiddleware,logoutUser)
routes.get('/role',authMiddleware,userAdminController)
routes.get('/',authMiddleware,currenctUserController)

module.exports = routes