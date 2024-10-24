const debug = require('debug')('&:SESIONES: handlers')
const services = require('@sesiones/services.js')


const sessionCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
     
    await services.sessionCount(userId);
        
    } catch (e) {
        debug('Error in handlers/SESIONES ' + e);
        next(e);
    }
};




module.exports = {
    sessionCount
}