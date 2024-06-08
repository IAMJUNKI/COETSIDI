const debug = require('debug')('&:GOOGLECALENDAR: handlers')
const services = require('./services.js')

const authCalendar = async (req, res, next) => {
    try {
        const userId = req.user.id
        const url = services.authentification(userId)
        res.redirect(`${url}`)
        // res.status(200).send('Schedule added to Google Calendar')
    } catch (e) {
        debug('Error en handlers/authCalendar ' + e)
        throw e
    }
};


module.exports = {
    authCalendar
}