import { MockOptions } from "./types";

/**
 * The default value for mock options.
 */
export const DEFAULT_MOCK_OPTIONS: MockOptions = {
    method: 'GET',
    data: null,
    headers: new Headers(),
};

/**
 * Map of status codes to status text.
 */
export const STATUS_TEXT_MAP = {
    200: "OK",
    201: "Created",
    204: "No Content",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    409: "Conflict",
    418: "I'm a teapot",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    503: "Service Unavailable",
};