const express = require('express');
const multer = require('multer');
const handlers = require('./handlers');

const upload = multer();

const gestorDataRouter = express.Router();

gestorDataRouter.post('/buscarAsignaturas', upload.none(),handlers.getAllSubjects);

module.exports = gestorDataRouter;
