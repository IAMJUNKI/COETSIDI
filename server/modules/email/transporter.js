const nodemailer = require('nodemailer')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.MAIL_CLIENT_ID, // ClientID
    process.env.MAIL_CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.MAIL_REFRESH_TOKEN
});


// if (process.env.NODE_ENV === 'development') {
    // transporter = nodemailer.createTransport({ // Yes. SMTP!
    //     host: process.env.UPM_MAILER_HOST,
    //     secureConnection: true, // use SSL
    //     port: 465, // port for secure SMTP
    //     auth: {
    //         user: process.env.UPM_MAILER_USER,
    //         pass: process.env.UPM_MAILER_PASS
    //     },
    //     tls: {
    //         rejectUnauthorized: false // Este parámetro puede ayudar si hay problemas con certificados SSL auto-firmados
    //     }
    // })


    // } 
    
   
async function createTransporter() {
    try {
      const accessToken = await oauth2Client.getAccessToken();
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USER,
          clientId: process.env.MAIL_CLIENT_ID,
          clientSecret: process.env.MAIL_CLIENT_SECRET,
          refreshToken: process.env.MAIL_REFRESH_TOKEN,
          accessToken: accessToken,
        }
      });
  
      transporter.verify((error, success) => {
        if (error) {
          console.error('Error in transporter:', error);
        } else {
          console.log('\x1b[36m%s\x1b[0m', 'Server with NodeMailer is ready --> emails');
        }
      });
  
      return transporter;
    } catch (error) {
      console.error('Failed to create transporter:', error);
      throw error;
    }
  }
  
  module.exports = { createTransporter };