const { google } = require('googleapis');

exports.handler = async function(event, context) {
  // CORS handling (allow POST requests)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }

  if (event.httpMethod === "POST") {
    try {
      // Get the service account credentials from the environment variable
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const data = JSON.parse(event.body);  // The RSVP data from the form

      const spreadsheetId = 'your-google-sheet-id';  // Replace with your Google Sheets ID
      const range = 'RSVPs!A1';  // Adjust the range according to your sheet

      // Append data to the Google Sheets document
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            [data.firstName, data.lastName, data.email, data.attendance, data.guests, data.message]
          ]
        }
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success' })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: 'error', message: err.message })
      };
    }
  }
};
