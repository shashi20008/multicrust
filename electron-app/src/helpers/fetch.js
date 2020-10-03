const _omit = require('lodash/omit');
const _pick = require('lodash/pick');

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/**
 * Generic HTTP request utility to fire a HTTP request of type `method`
 * at the resource identified by `uri`.
 * @param {String} uri - URI of the resource.
 * @param {String} [GET] method - HTTP method GET, POST, PUT, DELETE, PATCH, HEAD, etc.
 * @param {Buffer|String|Object|null} [null] body - Request payload (pass null to skip payload).
 * @param {Object} [{}] fetchOpts - Opaque options passed to underlying fetch.
 */
export async function makeHTTPRequest(
  uri,
  method = 'GET',
  body = null,
  fetchOpts = {}
) {
  const serialize =
    body !== null && !Buffer.isBuffer(body) && typeof body !== 'string';

  const resp = await fetch(uri, {
    method,
    credentials: 'same-origin',
    headers: {
      ...fetchOpts.headers,
      ...(serialize ? JSON_HEADERS : {}),
    },
    body: serialize ? JSON.stringify(body) : body,
    ..._omit(fetchOpts, ['method', 'headers', 'body']),
  });

  // We always deal with JSON.
  const respJSON = await resp.json();

  if (!resp.ok) {
    const err = new Error(`HTTP_${resp.status}`);
    err.status = resp.status;
    err.headers = resp.headers;
    err.body = respJSON;
    throw err;
  }

  return {
    ..._pick(resp, ['status', 'ok', 'headers']),
    body: respJSON,
  };
}

/**
 * Fires a HTTP Get request to the provided URI
 * @param {String} uri - URI of the resource to fetch.
 * @param {Object} fetchOpts - Opaque options passed to underlying fetch.
 */
export function httpGet(uri, fetchOpts) {
  return makeHTTPRequest(uri, 'GET', null, fetchOpts);
}

/**
 * Fires a HTTP POST request to the provided URI
 * @param {String} uri - URI of the resource to make POST request for.
 * @param {String|Buffer|Object} body - The payload of POST request.
 * @param {Object} fetchOpts - Opaque options passed to underlying fetch.
 */
export function httpPost(uri, body, fetchOpts) {
  return makeHTTPRequest(uri, 'POST', body, fetchOpts);
}
