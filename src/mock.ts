import { Mock } from "./mockClass";
import { DEFAULT_MOCK_OPTIONS } from "./constants";
import { MockOptions } from "./types";
import { findRequest, makeResponse, wildcardToRegex } from "./utils";

let ORIGINAL_FETCH: (request: Request, init?: RequestInit | undefined) => Promise<Response>;

/**
 * The cache for registered mocked requests.
 */
export const MOCKED_REQUESTS = new Map<RegExp, Mock>();

/**
 * @description Mock the fetch method.
 * @returns The mock instance.
 */
export const mock = (request: Request | RegExp | string, options: MockOptions = DEFAULT_MOCK_OPTIONS) => {
    const input = request instanceof Request ? request.url : request;

    // Create regex class from input.
    const regexInput = input instanceof RegExp ? input : new RegExp(wildcardToRegex(input.toString()));

    // Find the mock in cache.
    const cachedMock = [...MOCKED_REQUESTS.entries()].find(findRequest([regexInput.toString(), options]));

    let mockInstance = cachedMock?.[1];

    if (!cachedMock) {
        mockInstance = new Mock(regexInput, options);

        // Use regex as key.
        MOCKED_REQUESTS.set(regexInput, mockInstance);

        if(process.env.VERBOSE) {
            console.debug("\x1b[1mRegistered mocked request\x1b[0m");
            console.debug("\x1b[2mPath Pattern\x1b[0m", regexInput);
            console.debug("\x1b[2mMethod\x1b[0m", options.method);
            console.debug("\n");
        }
    } else {
        if(process.env.VERBOSE)
            console.debug("\x1b[1mRequest already mocked\x1b[0m", regexInput);
        return mockInstance!;
    }

    if (!ORIGINAL_FETCH) {
        // Cache the original fetch method before mocking it. Might be useful in the future to clean the mock.
        ORIGINAL_FETCH = globalThis.fetch;

        // @ts-ignore
        globalThis.fetch = MOCKED_FETCH;
    }

    return mockInstance;
}

/**
 * @description Clear the fetch mock.
 */
export const clearMocks = () => {
    MOCKED_REQUESTS.clear();
    // @ts-ignore
    globalThis.fetch = ORIGINAL_FETCH;
}

/**
 * @description A mocked fetch method.
 */
const MOCKED_FETCH = (_request: Request | RegExp | string, init?: RequestInit) => {
    const _path = _request instanceof Request ? _request.url : _request.toString();

    // When the request it fired, check if it matches a mocked request.
    const mockedRequest = [...MOCKED_REQUESTS.entries()].find(findRequest([_path, init]));

    // Run the original fetch method, if mock doesn't exist.
    if (!mockedRequest)
        return ORIGINAL_FETCH(_request as Request, init);

    if(process.env.VERBOSE)
        console.debug("\x1b[2mMocked fetch called\x1b[0m", _path);

    // Increment the number of mocked calls.
    mockedRequest[1]._incrementCalled();

    return makeResponse(200, _path, mockedRequest[1].options);
};