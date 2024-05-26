/// <reference types="node" />
type MockOptions = {
    data: any;
} & RequestInit;
/**
 * @description Mock the fetch method.
 */
export declare const mock: (request: Request | RegExp, options: MockOptions) => void;
/**
 * @description Clear the fetch mock.
 */
export declare const clearMocks: () => void;
export {};
