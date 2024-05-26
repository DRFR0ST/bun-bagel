import { expect, test, describe } from "bun:test";
import { mock, clearMocks } from "../src/mock";

describe("Mock", () => {
    test("mock: should mock a request", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(request, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should not mock a request twice", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        expect(mock(request, options)).toBe(undefined);
        await fetch("https://bun-bagel.sweet/api/v1/users");
    });

    test("mock: should mock a request with string path", async () => {
        const request = "https://bun-bagel.sweet/api/v1/users";
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(request, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should mock a request with wildcard", async () => {
        const request = "https://bun-bagel.sweet/api/v1/users/*";
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(request, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users/123");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should mock a request using a regular expression", async () => {
        new Request("https://bun-bagel.sweet/api/v1/users/1");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
        };
        mock(/\/api\/v1\/users\/\d+/, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users/1");
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should mock a request with method", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
            method: "POST"
        };
        mock(request, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users", { method: "POST" });
        const data = await response.json();
        expect(data).toEqual(options.data);
    });
    

    test("mock: should not mock a request with method", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/documents");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
            method: "POST"
        };
        mock(request, options);

        const act = async () => {
            await fetch("https://bun-bagel.sweet/api/v1/documents", { method: "PATCH" });
        }
        expect(act).toThrow();
    });

    test("mock: should mock a request with headers", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/users");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
            headers: { "x-foo-bar": "Foo" }
        };
        mock(request, options);
        const response = await fetch("https://bun-bagel.sweet/api/v1/users", { headers: { "x-foo-bar": "Foo" } });
        const data = await response.json();
        expect(data).toEqual(options.data);
    });

    test("mock: should not mock a request with headers", async () => {
        const request = new Request("https://bun-bagel.sweet/api/v1/documents");
        const options = {
            data: {
                id: 1,
                name: "John Doe",
            },
            headers: { "x-foo-bar": "Foo" }
        };
        mock(request, options);

        const act = async () => {
            await fetch("https://bun-bagel.sweet/api/v1/documents");
        }
        expect(act).toThrow();
    });

    test("mock: should not mock a request if it is not registered", async () => {
        const act = async () => {
            await fetch("https://bun-bagel.sweet/api/v1/posts");
        }
         expect(act).toThrow();
    });

    test("mock: should restore the original fetch method after the test", () => {
        clearMocks();
        expect(globalThis.fetch).not.toBeUndefined();
    });
});