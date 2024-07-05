const express = require('express');
const authHandlers = require('@auth/handlers');

const authRouter = express.Router();



authRouter.post('/login', authHandlers.loginUserHandler);

authRouter.post('/signup', authHandlers.signupNewUser);

authRouter.post('/enviarCorreoVerificacion', authHandlers.enviarCorreoDeVerificacion);

		
module.exports = authRouter;
