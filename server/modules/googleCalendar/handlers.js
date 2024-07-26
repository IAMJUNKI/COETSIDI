const debug = require('debug')('&:GOOGLECALENDAR:handlers');
const services = require('./services.js');

const authCalendar = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const authUrl = await services.getAuthUrl();
        res.json({ authUrl, userId });
    } catch (e) {
        debug('Error in handlers/authCalendar ' + e);
        next(e);
    }
};

const handleOAuthRedirect = async (req, res, next) => {
    try {
        const { code, userId } = req.query;
        const auth = await services.exchangeCodeForTokens(code);
        // const tokens = auth.credentials;

        // await services.saveTokens(userId, tokens);

        const eventIds = await services.createEvent(auth, userId);
        await services.guardarEventIds(eventIds, userId);

        return res.status(200).json({ message: 'success' })
    } catch (e) {
        debug('Error in handlers/handleOAuthRedirect ' + e);
        next(e);
    }
};

module.exports = {
    authCalendar,
    handleOAuthRedirect
};
