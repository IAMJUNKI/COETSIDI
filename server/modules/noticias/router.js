const express = require('express');
const handlers = require('@noticias/handlers');

const noticiasRouter = express.Router();

noticiasRouter.get('/getNoticias/:ano/:mes', handlers.getNoticias);
noticiasRouter.post('/crearNuevaNoticia', handlers.crearNuevaNoticia);
noticiasRouter.post('/borrarNoticia', handlers.borrarNoticia);


module.exports = noticiasRouter;
