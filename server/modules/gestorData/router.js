const express = require('express');
const multer = require('multer');
const handlers = require('./handlers');

const upload = multer();

const gestorDataRouter = express.Router();

gestorDataRouter.post('/buscarAsignaturas', upload.none(),handlers.getAllSubjects);
gestorDataRouter.post('/guardarAsignaturas', upload.none(),handlers.saveSubjects);
gestorDataRouter.get('/checkIfDataUserEmpty', handlers.checkDB);

module.exports = gestorDataRouter;
