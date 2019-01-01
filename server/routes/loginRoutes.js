const express = require('express');
const LoginController = require('../controllers/loginController');

const loginRouter = express.Router();

loginRouter.post('/login', LoginController.login);

loginRouter.post('/register', LoginController.createNewUser);

loginRouter.get('/available-email/:email', LoginController.checkIfEmailAvailable);

module.exports = loginRouter;
