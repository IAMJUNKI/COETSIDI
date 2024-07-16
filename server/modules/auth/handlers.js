

const authService = require('@auth/services');

function loginUserHandler(req, res, next) {
    authService.authenticateUser(req, res, next);
}

function signupNewUser(req, res, next) {
    authService.signupNewUser(req, res, next);
}

function enviarCorreoDeVerificacion(req, res, next) {
    authService.enviarCorreoDeVerificacion(req, res, next);
}

function enviarCorreoRecuperarContrasena(req, res, next) {
    authService.enviarCorreoRecuperarContrasena(req, res, next);
}

function cambiarContrasena(req, res, next) {
    authService.cambiarContrasena(req, res, next);
}


function verificarCodigo(req, res, next) {
    authService.verificarCodigo(req, res, next);
}

module.exports = {
    loginUserHandler,
    signupNewUser,
    enviarCorreoDeVerificacion,
    enviarCorreoRecuperarContrasena,
    verificarCodigo,
    cambiarContrasena
};

