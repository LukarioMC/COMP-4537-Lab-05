/**
 * Responds to a request with HTML data. No parsing of the data is done.
 * @param {http.ServerResponse} res
 * @param {number} statusCode   HTML status code
 * @param {object} data Raw HTML code
 */
function respondHTML(res, statusCode, data) {
    res.writeHead(statusCode, { 'content-type': 'text/html' });
    closeWithData(res, data);
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {number} statusCode   HTML status code
 * @param {object} data JSON object to stringify
 */
function respondJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'content-type': 'text/json' });
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
 * @param {number} reqNumber
 */
function logRequest(req, reqNumber) {
    console.log(`Server has begun serving request #${reqNumber}!`);
    console.log(`[${reqNumber}] Requested endpoint: ${req.url}`);
}

module.exports = {
    respondHTML,
    respondJSON,
    logRequest,
};
