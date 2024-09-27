import { beforeEach, describe, expect, test } from "bun:test";
import { clearMocks, mock } from "../src/mock";
import type { MockOptions } from "../src/types";

const API_URL = "https://bun-bagel.sweet/api/v1";

describe("Mock", () => {
	beforeEach(() => {
		clearMocks();
	});

	test("mock: should mock a request", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
		};
		const mocked = mock(request, options);

		const response = await fetch(`${API_URL}/users`);
		const data = await response.json();

		expect(response.status).toEqual(200);
		expect(data).toEqual(options.response?.data);
		expect(mocked).toEqual(true);
	});

	test("mock: should not mock a request twice", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
		};
		expect(mock(request, options)).toBe(true);

		// for some reason the expect function fails to infer the return type correctly and only infers
		// it as boolean so we specify the type of expect explicitly as the return type of the function
		expect<ReturnType<typeof mock>>(mock(request, options)).toBe(undefined);
		await fetch(`${API_URL}/users`);
	});

	test("mock: should mock a request with string path", async () => {
		const request = `${API_URL}/users`;
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users`);
		const data = await response.json();
		expect(data).toEqual(options.response?.data);
	});

	test("mock: should mock a request with wildcard", async () => {
		const request = `${API_URL}/users/*`;
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users/123`);
		const data = await response.json();
		expect(data).toEqual(options.response?.data);
	});

	test("mock: should mock a request using a regular expression", async () => {
		new Request(`${API_URL}/users/1`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
		};
		mock(/\/api\/v1\/users\/\d+/, options);
		const response = await fetch(`${API_URL}/users/1`);
		const data = await response.json();
		expect(data).toEqual(options.response?.data);
	});

	test("mock: should mock a request with method", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
			method: "POST",
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users`, { method: "POST" });
		const data = await response.json();
		expect(data).toEqual(options.response?.data);
	});

	test("mock: should not mock a request with method", async () => {
		const request = new Request(`${API_URL}/dogs`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
			method: "POST",
		};
		mock(request, options);

		const act = async () => {
			await fetch(`${API_URL}/dogs`, { method: "PATCH" });
		};
		expect(act).toThrow();
	});

	test("mock: should mock a request with headers", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
			headers: { "x-foo-bar": "Foo" },
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users`, {
			headers: { "x-foo-bar": "Foo" },
		});
		const data = await response.json();
		expect(data).toEqual(options.response?.data);
	});

	test("mock: should not mock a request with headers", async () => {
		const request = new Request(`${API_URL}/cats`);
		const options: MockOptions = {
			response: {
				data: {
					id: 1,
					name: "John Doe",
				},
			},
			headers: { "x-foo-bar": "Foo" },
		};
		mock(request, options);

		const act = async () => {
			await fetch(`${API_URL}/cats`);
		};
		expect(act).toThrow();
	});

	test("mock: should mock a request with response status", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			response: {
				data: { name: "John Doe" },
				status: 418,
			},
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users`);
		expect(response.status).toEqual(418);
	});

	test("mock: should mock a request with response headers", async () => {
		const request = new Request(`${API_URL}/users`);
		const options: MockOptions = {
			headers: { "x-foo-bar": "baz" },
			response: {
				data: { name: "John Doe" },
				headers: { "x-baz-qux": "quux" },
			},
		};
		mock(request, options);
		const response = await fetch(`${API_URL}/users`, {
			headers: { "x-foo-bar": "baz" },
		});

		expect(response.headers).toEqual(new Headers({ "x-baz-qux": "quux" }));
	});

	test("mock: should not mock a request if it is not registered", async () => {
		const act = async () => {
			await fetch(`${API_URL}/posts`);
		};
		expect(act).toThrow();
	});

	test("mock: should be async", () => {
		mock(`${API_URL}/cats`, { data: { meow: "meow" } });
		const r = fetch(`${API_URL}/cats`);
		expect(r.then).toBeDefined();
	});

	test("mock: should restore the original fetch method after the test", () => {
		mock(`${API_URL}/cats`, { data: { meow: "meow" } });
		const mockedFetch = globalThis.fetch;
		clearMocks();
		mock(`${API_URL}/cats`, { data: { purr: "purr" } });
		expect(globalThis.fetch.name).toBe(mockedFetch.name);
	});

	test("mock: should restore the original fetch method after the test", () => {
		clearMocks();
		expect(globalThis.fetch).not.toBeUndefined();
	});
});
