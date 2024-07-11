const express = require('express');
const handlers = require('@inicio/handlers');

const inicioRouter = express.Router();

// inicioRouter.post('/guardarSemestre/:semestre', handlers.guardarSemestre);
// inicioRouter.post('/guardarColor/:color', handlers.guardarColor);
inicioRouter.get('/getUserName', handlers.nombreDeUsuario);
inicioRouter.get('/getCoursesNowAndAfter', handlers.obtenerClasesEnCurso);
inicioRouter.post('/cambiarContrasena', handlers.cambiarContrasena);
inicioRouter.post('/cambiarNombre', handlers.cambiarNombre);


module.exports = inicioRouter;
