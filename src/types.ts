/**
 * The options for a mocked request.
 * Partial implementation of RequestInit with the addition of "data" property which value will be returned from the mock.
 */
export type MockOptions = {
    data?: any;
    headers?: RequestInit['headers'];
    method?: RequestInit['method'];
};
