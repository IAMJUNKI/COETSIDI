const express = require('express');
const handlers = require('./handlers');

const googleCalendarRouter = express.Router();

googleCalendarRouter.get('/authCalendar', handlers.authCalendar);


module.exports = googleCalendarRouter;
