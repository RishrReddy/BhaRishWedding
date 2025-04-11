// netlify/functions/submitRSVP.js
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "Preflight check passed"
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // You can store this in Netlify Forms, a file, or a backend DB
    console.log("Received RSVP:", data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "success" }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
};
