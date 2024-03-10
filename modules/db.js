const { Client } = require('pg');
const { respondJSON } = require('./utils');

const client = new Client(process.env.DATABASE_URL);

async function executeSQL(userQuery) {
    await client.connect();
    try {
        const result = await client.query(userQuery);
        return result;
    } catch (err) {
        return err;
    } finally {
        client.end();
    }
}

async function handleSQLRequest(req, res) {
    switch (req.method) {
        case 'GET':
            handleGet(req, res);
            break;
        case 'POST':
            handlePost(req, res);
            break;
        default:
            respondJSON(res, 405, {
                status: 405,
                error: 'Invalid HTTP method called! Allowed: GET, POST',
            });
            break;
    }
}

async function handleGet(req, res) {
    const parsedAddress = new URL(req.url);
    let query = parsedAddress.searchParams.get('query')?.trim();
    if (!query) {
        return respondJSON(res, 400, {
            status: 400,
            error: 'Property "query" must be in request query string',
        });
    }
    query = decodeURIComponent(query); // Decode any URI encoding
    console.log('Query to run on server: ' + query);
    result = await executeSQL(query);
    console.log('Query result from server: ' + result);
    respondJSON(res, 200, result);
}

async function handlePost(req, res) {}

module.exports = {
    handleSQLRequest,
};
