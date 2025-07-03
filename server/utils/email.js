const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

// Load client secrets from a local file.
function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('Missing credentials.json. Please download it from Google Cloud Console and place it in the server/ directory.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

// Authorize a client with credentials, then call the Gmail API.
function authorize(callback) {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    return callback(oAuth2Client);
  } else {
    // First time: prompt user to authorize
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    throw new Error('First-time Gmail API setup: Visit the URL above, authorize, and save the token.json as instructed.');
  }
}

// Helper to encode email for Gmail API
function makeBody(to, from, subject, message) {
  const str = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    message,
  ].join('\n');
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Send email using Gmail API
const sendEmail = async (emailData) => {
  return new Promise((resolve, reject) => {
    authorize(async (auth) => {
      const gmail = google.gmail({ version: 'v1', auth });
      const raw = makeBody(
        emailData.to,
        process.env.SMTP_USER, // sender
        emailData.subject,
        emailData.html || emailData.content || emailData.text
      );
      try {
        const res = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw },
        });
        console.log('Email sent successfully:', res.data.id);
        resolve({ success: true, messageId: res.data.id });
      } catch (error) {
        console.error('Error sending email:', error);
        reject({ success: false, error: error.message });
      }
    });
  });
};

// All email logic removed. Export empty async functions to avoid breaking imports.
async function sendContactNotification() { return; }
async function sendContactConfirmation() { return; }
module.exports = { sendContactNotification, sendContactConfirmation }; 