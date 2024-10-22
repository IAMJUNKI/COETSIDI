const nodemailer = require('nodemailer')
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//     process.env.MAIL_CLIENT_ID, // ClientID
//     process.env.MAIL_CLIENT_SECRET, // Client Secret
//     "https://developers.google.com/oauthplayground" // Redirect URL
// );

// oauth2Client.setCredentials({
//     refresh_token: process.env.MAIL_REFRESH_TOKEN
// });


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
    
   
// async function createTransporter() {
//     try {
//       const accessToken = await oauth2Client.getAccessToken();
  
//       const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         secure: true, // use SSL
//         port: 465, // port for secure SMTP
//         auth: {
//           type: 'OAuth2',
//           user: process.env.MAIL_USER,
//           clientId: process.env.MAIL_CLIENT_ID,
//           clientSecret: process.env.MAIL_CLIENT_SECRET,
//           refreshToken: process.env.MAIL_REFRESH_TOKEN,
//           accessToken: accessToken,
//         }
//       });
  
//       transporter.verify((error, success) => {
//         if (error) {
//           console.error('Error in transporter:', error);
//         } else {
//           console.log('\x1b[36m%s\x1b[0m', 'Server with NodeMailer is ready --> emails');
//         }
//       });
  
//       return transporter;
//     } catch (error) {
//       console.error('Failed to create transporter:', error);
//       throw error;
//     }
//   }

  
async function createTransporter() {
  try {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD
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

// async function createTransporter() {
//   try {
//       console.log('Starting transporter creation...');
      
//       // Try to get an access token
//       const accessToken = await oauth2Client.getAccessToken();
//       console.log('Access Token:', accessToken);

//       // Set up nodemailer transporter
//       const transporter = nodemailer.createTransport({
//           service: 'Gmail',
//           secure: true, // Use SSL
//           port: 465, // Port for secure SMTP
//           auth: {
//               type: 'OAuth2',
//               user: process.env.MAIL_USER,
//               clientId: process.env.MAIL_CLIENT_ID,
//               clientSecret: process.env.MAIL_CLIENT_SECRET,
//               refreshToken: process.env.MAIL_REFRESH_TOKEN,
//               accessToken: accessToken.token, // .token ensures it's not a Promise object
//           },
//       });

//       // Verify transporter
//       transporter.verify((error, success) => {
//           if (error) {
//               console.error('Error in transporter verification:', error);
//           } else {
//               console.log('\x1b[36m%s\x1b[0m', 'Server with NodeMailer is ready --> emails');
//           }
//       });

//       return transporter;
//   } catch (error) {
//       console.error('Failed to create transporter:', error);
//       throw error;
//   }
// }



//   const nodemailer = require('nodemailer');
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//     process.env.MAIL_CLIENT_ID, // Client ID
//     process.env.MAIL_CLIENT_SECRET, // Client Secret
//     "https://developers.google.com/oauthplayground" // Redirect URL
// );

// // Set initial credentials using the refresh token
// oauth2Client.setCredentials({
//     refresh_token: process.env.MAIL_REFRESH_TOKEN
// });

// async function createTransporter() {
//     try {
//         // Get the access token (will be refreshed automatically if expired)
//         const { token: accessToken } = await oauth2Client.getAccessToken();

//         const transporter = nodemailer.createTransport({
//             service: 'Gmail',
//             secure: true, // Use SSL
//             port: 465, // Secure SMTP port
//             auth: {
//                 type: 'OAuth2',
//                 user: process.env.MAIL_USER,
//                 clientId: process.env.MAIL_CLIENT_ID,
//                 clientSecret: process.env.MAIL_CLIENT_SECRET,
//                 refreshToken: process.env.MAIL_REFRESH_TOKEN,
//                 accessToken: accessToken, // Automatically refreshed token
//             }
//         });

//         // Verify the transporter
//         await transporter.verify();
//         console.log('\x1b[36m%s\x1b[0m', 'Server with NodeMailer is ready --> emails');

//         return transporter;
//     } catch (error) {
//         console.error('Failed to create transporter:', error);
//         throw error;
//     }
// }

// module.exports = { createTransporter };