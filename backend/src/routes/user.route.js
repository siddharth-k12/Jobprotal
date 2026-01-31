const express = require('express');
const { registerHandler, loginController, updateController, passwordController, logoutUser, userAdminController, currenctUserController } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware')
const routes = express.Router();

routes.post('/register',registerHandler)
routes.post('/login',loginController)
routes.patch('/update',authMiddleware,updateController)
routes.patch('/password',authMiddleware,passwordController)
routes.post('/logout',authMiddleware,logoutUser)
routes.get('/role',authMiddleware,userAdminController)
routes.get('/',authMiddleware,currenctUserController)

module.exports = routes