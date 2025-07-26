exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // URL directa del CSV de Google Sheets
    const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnf4Sm6V9ZWNHbHKDtC10sXRmxtdvO66SMFeIGIGE7SYeUgqbqeod010MNeGV0p3KIVcPOVmhBwpFI/pub?output=csv';
    
    console.log('Fetching data from Google Sheets...');
    
    const response = await fetch(googleSheetsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Netlify-Function/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvData = await response.text();
    console.log(`Successfully fetched ${csvData.length} characters of CSV data`);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv; charset=utf-8',
      },
      body: csvData,
    };

  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch data from Google Sheets',
        message: error.message,
      }),
    };
  }
};