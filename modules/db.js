const { Pool } = require('pg');
const url = require('url');
const { respondJSON } = require('./utils');

const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 32,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

async function executeSQL(userQuery) {
    try {
        const result = await client.query(userQuery);
        return { status: 'ok', result };
    } catch (err) {
        console.error(err);
        return { status: 'error', err };
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
    const parsedAddress = url.parse(req.url, true);
    // Get SQL statement/query from URL query string
    let query = parsedAddress?.query['query']?.trim();
    if (!query) {
        return respondJSON(res, 400, {
            status: 400,
            error: 'Property "query" must be in request query string',
        });
    } else {
        result = await executeSQL(query);
        respondJSON(res, 200, result);
    }
}

async function handlePost(req, res) {
    let payload = '';
    req.on('data', (data) => {
        payload += data;
    });
    req.on('end', async () => {
        const body = JSON.parse(payload);
        executeSQL(body.query)
            .then((result) => {
                respondJSON(res, 200, result);
            })
            .catch((err) => {
                respondJSON(res, 400, err);
            });
    });
}

module.exports = {
    handleSQLRequest,
};
