const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const { knex } = require('@db/knex.js');
const helpers = require('./helpers.js');

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials.json');

async function getAuthUrl() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });

    return authUrl;
}

async function exchangeCodeForTokens(code) {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    return oAuth2Client;
}

// async function saveTokens(userId, tokens) {
//     await knex('t_horarios').update({ tokens: JSON.stringify(tokens) }).where({ user_id: userId });
// }

async function createEvent(auth, userId) {
    const eventIds = await getEventIds(userId);
    if (eventIds !== null) await deleteEventsBatch(auth, eventIds);

    try {
        const events = await helpers.formatEventsForGoogleCalendar(userId);
        return createEventsBatch(auth, events);
    } catch (error) {
        console.error('Error creating event: ', error);
    }
}

async function createEventsBatch(auth, events) {
    const url = 'https://www.googleapis.com/batch/calendar/v3';
    const boundary = 'batch_calendar_boundary';
    let batchBody = '';

    events.forEach((event) => {
        batchBody += `--${boundary}\n`;
        batchBody += 'Content-Type: application/http\n';
        batchBody += 'Content-Transfer-Encoding: binary\n\n';
        batchBody += `POST /calendar/v3/calendars/primary/events\n`;
        batchBody += 'Content-Type: application/json\n\n';
        batchBody += JSON.stringify(event) + '\n\n';
    });

    batchBody += `--${boundary}--`;

    try {
        const response = await axios.post(url, batchBody, {
            headers: {
                'Content-Type': `multipart/mixed; boundary=${boundary}`,
                Authorization: `Bearer ${auth.credentials.access_token}`,
            },
        });

        const eventIds = [];
        const regex = /"id":\s*"([^"]+)"/g;
        let match;

        while ((match = regex.exec(response.data)) !== null) {
            eventIds.push(match[1]);
        }

        return eventIds;
    } catch (error) {
        console.error('Error creating events in batch: ', error.response ? error.response.data : error.message);
    }
}

async function deleteEventsBatch(auth, eventIds) {
    const url = 'https://www.googleapis.com/batch/calendar/v3';
    const boundary = 'batch_calendar_boundary';
    let batchBody = '';

    eventIds.forEach((eventId) => {
        batchBody += `--${boundary}\n`;
        batchBody += 'Content-Type: application/http\n';
        batchBody += 'Content-Transfer-Encoding: binary\n\n';
        batchBody += `DELETE /calendar/v3/calendars/primary/events/${eventId}\n\n`;
    });

    batchBody += `--${boundary}--`;

    try {
        await axios.post(url, batchBody, {
            headers: {
                'Content-Type': `multipart/mixed; boundary=${boundary}`,
                Authorization: `Bearer ${auth.credentials.access_token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting events in batch: ', error.response ? error.response.data : error.message);
    }
}

async function guardarEventIds(eventIds, userId) {
    await knex('t_horarios').update({ calendar_event_ids: JSON.stringify(eventIds) }).where({ user_id: userId });
}

async function getEventIds(userId) {
    const eventIds = await knex('t_horarios').first('calendar_event_ids').where({ user_id: userId });
    return eventIds.calendar_event_ids;
}

module.exports = { getAuthUrl, exchangeCodeForTokens, createEvent, guardarEventIds };
