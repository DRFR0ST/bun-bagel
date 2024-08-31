import { DEFAULT_MOCK_OPTIONS } from "./constants";
import { MockOptions } from "./types";
import { findRequest, makeResponse, wildcardToRegex } from "./utils";

let ORIGINAL_FETCH: (request: Request, init?: RequestInit | undefined) => Promise<Response>;

/**
 * The cache for registered mocked requests.
 */
const MOCKED_REQUESTS = new Map<RegExp, MockOptions>();

/**
 * @description Mock the fetch method.
 */
export const mock = (request: Request | RegExp | string, options: MockOptions = DEFAULT_MOCK_OPTIONS) => {
    const input = request instanceof Request ? request.url : request;

    // Create regex class from input.
    const regexInput = input instanceof RegExp ? input : new RegExp(wildcardToRegex(input.toString()));

    // Check if request is already mocked.
    const isRequestMocked = [...MOCKED_REQUESTS.entries()].find(findRequest([regexInput.toString(), options]));

    if (!isRequestMocked) {
        // Use regex as key.
        MOCKED_REQUESTS.set(regexInput, options);

        if(process.env.VERBOSE) {
            console.debug("\x1b[1mRegistered mocked request\x1b[0m");
            console.debug("\x1b[2mPath Pattern\x1b[0m", regexInput);
            console.debug("\x1b[2mMethod\x1b[0m", options.method);
            console.debug("\n");
        }
    } else {
        if(process.env.VERBOSE)
            console.debug("\x1b[1mRequest already mocked\x1b[0m", regexInput);
        return;
    }

    if (!ORIGINAL_FETCH) {
        // Cache the original fetch method before mocking it. Might be useful in the future to clean the mock.
        ORIGINAL_FETCH = globalThis.fetch;

        // @ts-ignore
        globalThis.fetch = MOCKED_FETCH;
    }
}

/**
 * @description Clear the fetch mock.
 */
export const clearMocks = () => {
    MOCKED_REQUESTS.clear();
    // @ts-ignore
    globalThis.fetch = ORIGINAL_FETCH;
    // @ts-ignore
    ORIGINAL_FETCH = undefined;
}

/**
 * @description A mocked fetch method.
 */
const MOCKED_FETCH = async (_request: Request | RegExp | string, init?: RequestInit) => {
    const _path = _request instanceof Request ? _request.url : _request.toString();

    // When the request it fired, check if it matches a mocked request.
    const mockedRequest = [...MOCKED_REQUESTS.entries()].find(findRequest([_path, init]));

    if (!mockedRequest)
        return Promise.reject(makeResponse(404));

    if(process.env.VERBOSE)
        console.debug("\x1b[2mMocked fetch called\x1b[0m", _path);

    return makeResponse(200, mockedRequest[1]);
};

