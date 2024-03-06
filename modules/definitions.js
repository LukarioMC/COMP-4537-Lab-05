const { OK, NOT_FOUND, BAD_REQUEST } = require('./status_codes');
const { respondJSON } = require('./utils');

// Used for storing definitions in-memory
const definition_keys = new Set();
const definitions = {};

/**
 * Handles a GET or POST request for a simple dictionary.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function handleDefinition(req, res) {
    const method = req.method;
    if (method === 'GET') {
        const data = retrieveDefinition(req);
        respondJSON(res, data.status, data);
    } else if (method === 'POST') {
        let query_data = '';
        req.on('data', (chunk) => {
            query_data += chunk;
        });
        req.on('end', () => {
            const query = JSON.parse(query_data);
            const data = storeDefinition(query);
            respondJSON(res, data.status, data);
        });
    }
}

/**
 * Stores a definiton based on an incoming HTTP POST request body. POST requests
 * are expected to have a JSON body containing a "word" and "definition".
 *
 * Example: {
 *  word: "moon",
 *  definition: "A natural satellite revolving around a planet."
 * }
 *
 * Returns an object containing a status, and either an error or details
 * property with additional information.
 *
 * @param {http.IncomingMessage} req
 * @returns object with status, and either an error or details property
 */
function storeDefinition(req) {
    const { word, definition } = req;
    if (!word) {
        return { status: BAD_REQUEST, error: 'No word parameter in request' };
    } else if (definition_keys.has(word)) {
        return { status: BAD_REQUEST, error: 'Requested word already defined' };
    } else {
        definition_keys.add(word);
        definitions[word] = definition;
        return {
            status: OK,
            details: `Added definition for ${word}. Definition: ${definition}`,
        };
    }
}

/**
 * Retrieves a definition
 *
 * GET requests are expected to have a "word" query parameter.
 *  Example: "localhost:8000/api/definitions?word=moon"
 * @param {http.IncomingMessage} req
 * @returns object with status, and either an error or definition property
 */
function retrieveDefinition(req) {
    const query_string = req.url.substring(req.url.indexOf('?') + 1);
    const params = new URLSearchParams(query_string);
    const word = params.get('word');
    if (!word) {
        return { status: BAD_REQUEST, error: 'No word parameter in query' };
    } else if (definition_keys.has(word)) {
        return { status: OK, definition: definitions[word] };
    } else {
        return { status: NOT_FOUND, error: `No definition found for ${word}` };
    }
}

module.exports = {
    handleDefinition,
};
