const fs = require('fs');
const path = require('path');
const process = require('process');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const helpers = require('./helpers.js')
const axios = require('axios');
const { knex } = require('@db/knex.js');
const express = require('express');

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
const TOKEN_PATH = path.join(process.cwd(), '../token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials.json');

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  const code = await getAccessCode(authUrl, redirect_uris[0]);
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Guarda el token de usuario, igual no guardarlo nunca o guardarlo en la base de datos NUNCA en vdad está bien porque asi no guardamos informacion sobre el usuario
  // fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  // console.log('Token stored to', TOKEN_PATH);

  return oAuth2Client;
}

async function getAccessCode(authUrl, redirectUri) {
  const { default: open } = await import('open');
  return new Promise((resolve, reject) => {
    const oauthRouter = express();

    oauthRouter.get('/oauthGoogle', (req, res) => {
      const code = req.query.code;
      res.send('¡Se ha incluido tu horario a tu google calendar! Puedes cerrar esta pestaña.');
      server.close(() => {
        resolve(code);
      });
    });

    const server = oauthRouter.listen(3000, () => {
      open(authUrl).catch(err => {
        console.error('Error opening URL:', err);
        reject(err);
      });
    });
  });
}

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

// Batch of created EVENTS
async function createEventsBatch(auth, events) {
  const url = 'https://www.googleapis.com/batch/calendar/v3';
  const boundary = 'batch_calendar_boundary';
  let batchBody = '';

  events.forEach((event, index) => {
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
     // console.log(response.data)
    return eventIds;
  } catch (error) {
    console.error('Error creating events in batch: ', error.response ? error.response.data : error.message);
  }
}

// DELETE previously created events saved in the database in a BATCH
async function deleteEventsBatch(auth, eventIds) {
  const url = 'https://www.googleapis.com/batch/calendar/v3';
  const boundary = 'batch_calendar_boundary';
  let batchBody = '';

  eventIds.forEach((eventId, index) => {
    batchBody += `--${boundary}\n`;
    batchBody += 'Content-Type: application/http\n';
    batchBody += 'Content-Transfer-Encoding: binary\n\n';
    batchBody += `DELETE /calendar/v3/calendars/primary/events/${eventId}\n\n`;
  });

  batchBody += `--${boundary}--`;

  try {
    const response = await axios.post(url, batchBody, {
      headers: {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        Authorization: `Bearer ${auth.credentials.access_token}`,
      },
    });

        // console.log('Batch delete response: ', response.data);
  } catch (error) {
    console.error('Error deleting events in batch: ', error.response ? error.response.data : error.message);
  }
}

async function guardarEventIds(eventIds, user_id) {
  await knex('t_horarios').update({ calendar_event_ids: JSON.stringify(eventIds) }).where({ user_id });
}

async function getEventIds(user_id) {
  const eventIds = await knex('t_horarios').first('calendar_event_ids').where({ user_id });
  return eventIds.calendar_event_ids;
}

function authentification(userId) {
  return authorize().then(auth => createEvent(auth, userId))
    .then(eventIds => guardarEventIds(eventIds, userId)).catch(console.error);
}

module.exports = { authentification };