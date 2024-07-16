const express = require('express');
const authHandlers = require('@auth/handlers');

const authRouter = express.Router();



authRouter.post('/login', authHandlers.loginUserHandler);

authRouter.post('/signup', authHandlers.signupNewUser);

authRouter.post('/enviarCorreoVerificacion', authHandlers.enviarCorreoDeVerificacion);

authRouter.post('/enviarCorreoRecuperarContrasena', authHandlers.enviarCorreoRecuperarContrasena);

authRouter.post('/cambiarContrasena', authHandlers.cambiarContrasena);

authRouter.post('/verificarCodigo', authHandlers.verificarCodigo);
		
module.exports = authRouter;
