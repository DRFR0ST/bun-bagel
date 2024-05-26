import { wildcardToRegex } from "./utils";

type MockOptions = {
    data: any;
} & RequestInit;

let ORIGINAL_FETCH: (request: Request, init?: RequestInit | undefined) => Promise<Response>;

const MOCKED_REQUESTS = new Map<RegExp, MockOptions>();

/**
 * @description Mock the fetch method.
 */
export const mock = (request: Request | RegExp, options: MockOptions) => {
    const input = request instanceof Request ? request.url : request;

    // Create regex class from input.
    const regexInput = input instanceof RegExp ? input : new RegExp(wildcardToRegex(input.toString()));

    // Check if request is already mocked.
    const isRequestMocked = [...MOCKED_REQUESTS.keys()].find(key => key.toString() === regexInput.toString());

    if (!isRequestMocked) {
        // Use regex as key.
        MOCKED_REQUESTS.set(regexInput, options);
        console.debug("Registered mocked request", input, regexInput);
    } else {
        console.debug("Request already mocked", regexInput);
        return;
    }

    // Cache the original fetch method before mocking it. Might be useful in the future to clean the mock.
    if (!ORIGINAL_FETCH)
        ORIGINAL_FETCH = globalThis.fetch;

    // @ts-ignore
    globalThis.fetch = (_path: string) => {
        // When the request it fired, check if it matches a mocked request.
        const mockedRequest = [...MOCKED_REQUESTS.entries()].find(([key]) =>
            _path.match(key)?.[0]
        );

        if (!mockedRequest)
            return Promise.reject({
                status: 404,
                ok: false,
                statusText: "Not Found",
                url: _path,
            });

        console.debug("Mocked fetch called:", _path, mockedRequest[0]);

        return Promise.resolve({
            status: 200,
            ok: true,
            // Return the mocked response.
            json: () => Promise.resolve(mockedRequest[1].data),
        })
    };
}

/**
 * @description Clear the fetch mock.
 */
export const clearMocks = () => {
    MOCKED_REQUESTS.clear();
    // @ts-ignore
    globalThis.fetch = ORIGINAL_FETCH;
}

