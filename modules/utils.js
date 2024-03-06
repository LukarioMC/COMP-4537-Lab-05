// Controls which resources can access the API
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
};

/**
 * Responds to a request with HTML data. No parsing of the data is done.
 * @param {http.ServerResponse} res
 * @param {number} statusCode   HTML status code
 * @param {object} data Raw HTML code
 */
function respondHTML(res, statusCode, data) {
    res.writeHead(statusCode, { ...CORS_HEADERS, 'content-type': 'text/html' });
    closeWithData(res, data);
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {number} statusCode   HTML status code
 * @param {object} data JSON object to stringify
 */
function respondJSON(res, statusCode, data) {
    res.writeHead(statusCode, { ...CORS_HEADERS, 'content-type': 'text/json' });
    closeWithData(res, JSON.stringify(data));
}

/**
 * Closes and ends a response with some data.
 * @param {http.ServerResponse} res
 * @param {object} data
 */
function closeWithData(res, data) {
    res.write(data);
    res.end();
}

/**
 * Logs the incoming request to the console.
 * @param {http.IncomingMessage} req
 */
function logRequest(req) {
    console.log('The server received a request!');
    console.log('Request details: ' + req.url);
}

module.exports = {
    respondHTML,
    respondJSON,
    logRequest,
};
