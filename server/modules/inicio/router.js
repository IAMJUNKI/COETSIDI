const express = require('express');
const handlers = require('@inicio/handlers');

const inicioRouter = express.Router();

inicioRouter.get('/getUserName', handlers.nombreDeUsuario);
inicioRouter.get('/getCoursesNowAndAfter', handlers.obtenerClasesEnCurso);
inicioRouter.post('/cambiarContrasena', handlers.cambiarContrasena);
inicioRouter.post('/cambiarNombre', handlers.cambiarNombre);


module.exports = inicioRouter;
