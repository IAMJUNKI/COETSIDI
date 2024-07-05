

const authService = require('@auth/services');

function loginUserHandler(req, res, next) {
    authService.authenticateUser(req, res, next);
}

function signupNewUser(req, res, next) {
    authService.signupNewUser(req, res, next);
}

function enviarCorreoDeVerificacion(req, res, next) {
    authService.enviarCorreo(req, res, next);
}

function verificarCodigo(req, res, next) {
    authService.verificarCodigo(req, res, next);
}

module.exports = {
    loginUserHandler,
    signupNewUser,
    enviarCorreoDeVerificacion,
    verificarCodigo
};

