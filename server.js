/**
 * A simple API server that can handle a GET request to retrieve a definition &
 * a POST request to store a definition.
 */
require('dotenv').config();
const http = require('http');
const { respondJSON, logRequest } = require('./modules/utils');
const { handleSQLRequest } = require('./modules/db');
const PORT = process.env.PORT || 8000;

// Tracks total number of requests
let requestCount = 0;

/**
 * CORS Function copied directly from https://vercel.com/guides/how-to-enable-cors
 * used as middleware to set CORS headers
 * @param {*} fn
 * @returns CORS Wrapper function
 */
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    // Early accept any preflight requests
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }
    return await fn(req, res);
};

/**
 * Handles an incoming HTTP request. Delegates handling to routing map.
 * Rejects invalid requests with 404 status code.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function handleRequest(req, res) {
    if (req?.url?.startsWith('/api/sql')) {
        return allowCors(handleSQLRequest)(req, res);
    } else {
        respondJSON(res, 404, { status: 404, error: 'Invalid request' });
    }
}

// Begins the server and attaches the request handler.
http.createServer((req, res) => {
    requestCount += 1;
    logRequest(req, requestCount);
    handleRequest(req, res);
}).listen(PORT);

console.log(`Server is running on http://localhost:${PORT} for requests...`);
