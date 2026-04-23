const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

const CLIENT_ID = process.argv[2];
const CLIENT_SECRET = process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('Usage: node get_refresh_token.js <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost'
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n1. Open this URL in your browser:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n2. After logging in, copy the "code" parameter from the URL and paste it here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code.trim(), (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    
    if (!token.refresh_token) {
      console.log('\nWARNING: No refresh token was returned.');
    } else {
      const output = `GOOGLE_CLIENT_ID=${CLIENT_ID}\nGOOGLE_CLIENT_SECRET=${CLIENT_SECRET}\nGOOGLE_REFRESH_TOKEN=${token.refresh_token}\n`;
      fs.writeFileSync('tokens.txt', output);
      console.log('\n--- SUCCESS! ---');
      console.log('The tokens have been saved to "backend/tokens.txt".');
      console.log('Open that file, copy EVERYTHING, and paste it into your .env files.');
    }
  });
});
