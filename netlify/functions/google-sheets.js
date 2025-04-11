const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
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
      // Read the service account credentials (this file should be placed in the 'config' folder)
      const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/your-service-account-file.json')));

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const data = JSON.parse(event.body);  // Assuming the form data is passed as JSON in the request body

      const spreadsheetId = '1kdSBm_DoXE2n-FjtuzIoB7DAbqxrlJ8QdkO7bHNNwK8';  // Replace with your Google Sheet ID
      const range = 'Sheet1!A1';  // Adjust the range as needed

      // Append the data to the Google Sheet
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
