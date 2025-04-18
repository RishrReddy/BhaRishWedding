const { google } = require('googleapis');
console.log('Google Credentials:', process.env.GOOGLE_CREDENTIALS); 
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Service account credentials
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n'); 

exports.handler = async function(event, context) {
    // CORS headers for preflight (OPTIONS request) and normal request
    const headers = {
        'Access-Control-Allow-Origin': '*',  // Adjust this to allow only specific domains like 'https://rishrreddy.github.io'
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow methods
        'Access-Control-Allow-Headers': 'Content-Type',  // Allow Content-Type header
    };

    // Handle OPTIONS request for CORS preflight checks
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' }),
        };
    }

    // Handle POST request for form submission
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Method Not Allowed
            headers: headers,
            body: JSON.stringify({ message: 'Only POST requests are allowed' }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Authenticate using Google Sheets API
        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets'],
            null
        );

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1kdSBm_DoXE2n-FjtuzIoB7DAbqxrlJ8QdkO7bHNNwK8'; // The ID of your Google Sheet

        const range = 'RSVPs!A2:G';  // Change this to match your sheet's range
        const valueInputOption = 'RAW';
        const resource = {
            values: [[
                new Date(),
                data.firstName,
                data.lastName,
                data.email,
                data.attendance,
                data.guests,
                data.message
            ]],
        };
        console.log("Formatted row values:", resource);
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });
        console.log("Sheets API response:", response.data); // 👈 Log API response

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'RSVP Submitted' }),
        };
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Error submitting RSVP' }),
        };
    }
};
