const fs = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const helpers = require('./helpers.js')
const axios = require('axios');
const { knex } = require('@db/knex.js')

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
const TOKEN_PATH = path.join(process.cwd(), '../token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
      const content = fs.readFileSync(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
  } catch (err) {
      return null;
  }
}


async function saveCredentials(client) {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
      return client;
  }
  client = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
  });
  if (client.credentials) {
      await saveCredentials(client);
  }
  return client;
}

async function createEvent(auth, userId) {

  const eventIds = await getEventIds(userId)
  if (eventIds !== null)  await deleteEventsBatch(auth, eventIds)
  
  try {
    
    const events = await helpers.formatEventsForGoogleCalendar(userId)
    return createEventsBatch(auth, events);

    //para eventos individuales--------
    // console.log(events,'events')
    //   const response = await calendar.events.insert({
    //       calendarId: 'primary',
    //       resource: events,
    //   });
    //   console.log('Event created: %s', response.data.htmlLink);
    //   return response.data.htmlLink
  } catch (error) {
      console.error('Error creating event: ', error);
  }
}

//batch of Created EVENTS
async function createEventsBatch(auth, events) {
  // const calendar = google.calendar({ version: 'v3', auth });
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

//DELETE borra los eventos creados anteriormente guardados en la base de datos en un BATCH
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

async function guardarEventIds (eventIds,user_id) {
  await knex('t_horarios').update({calendar_event_ids : `${JSON.stringify(eventIds)}`}).where({user_id})
}

async function getEventIds (user_id) {
  const eventIds = await knex('t_horarios').first('calendar_event_ids').where({user_id})
  return eventIds.calendar_event_ids
}


function authentification (userId){
  return authorize().then( auth => createEvent(auth,userId))
  .then(eventIds => guardarEventIds(eventIds, userId)).catch(console.error);
}

module.exports = {authentification}

