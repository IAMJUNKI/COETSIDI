const express = require('express');
const handlers = require('@sesiones/handlers');

const sesionesRouter = express.Router();

sesionesRouter.post('/sessionCount', handlers.sessionCount);


module.exports = sesionesRouter;
