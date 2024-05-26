import { expect, test, describe } from "bun:test";
import { mock, clearMocks } from "../src/mock.ts";

describe("Mock", () => {
    test("mock: should mock a request", async () => {
        const request = new Request("https://example.com/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(request, options);
        const response = await fetch("https://example.com/api/v1/users");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should not mock a request twice", async () => {
        const request = new Request("https://example.com/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        expect(await mock(request, options)).toBe(undefined);
        await fetch("https://example.com/api/v1/users");
    });

    test("mock: should mock a request using a regular expression", async () => {
        new Request("https://example.com/api/v1/users/1");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(/\/api\/v1\/users\/\d+/, options);
        const response = await fetch("https://example.com/api/v1/users/1");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    // test("mock: should not mock a request if it is not registered", async () => {
    //     new Request("https://example.com/api/v1/posts");

    //     const act = async () => {
    //         await fetch("https://example.com/api/v1/posts");
    //     }
    //      expect(act).toThrow({
    //         status: 404,
    //         ok: false,
    //         error: "Not Found",
    //         statusText: "Not Found",
    //         url: "https://example.com/api/v1/posts",
    //     });
    // });

    test("mock: should restore the original fetch method after the test", () => {
        clearMocks();
        expect(globalThis.fetch).not.toBeUndefined();
    });
});