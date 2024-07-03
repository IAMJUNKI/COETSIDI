const debug = require('debug')('&:GOOGLECALENDAR: handlers')
const services = require('./services.js')

const authCalendar = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Await the URL from authentification
        const done = await services.authentification(userId);
        
        res.send(done);
    } catch (e) {
        debug('Error in handlers/authCalendar ' + e);
        next(e); // Proper error handling with next middleware
    }
};

module.exports = {
    authCalendar
}