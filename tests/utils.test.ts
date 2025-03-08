import { describe, expect, test } from "bun:test";
import { DEFAULT_MOCK_OPTIONS } from "../src/constants";
import { findRequest, makeResponse, wildcardToRegex } from "../src/utils";
import type { MockOptions } from "../src/index";

type MockArr = [RegExp, (MockOptions | undefined)?];

describe("Utils", () => {
	describe("wildcardToRegex", () => {
		test("should convert a wildcard string to a regular expression", () => {
			expect(wildcardToRegex("/api/*").toString()).toBe((/\/api\/[\s\S]*$/).toString());
			expect(wildcardToRegex("/api/*/users").toString()).toBe(
				(/\/api\/[\s\S]*\/users$/).toString(),
			);
			expect(wildcardToRegex("/api/**/users").toString()).toBe(
				(/\/api\/[\s\S]*[\s\S]*\/users$/).toString(),
			);
			expect(wildcardToRegex("/api/v1/users/:id").toString()).toBe(
				(/\/api\/v1\/users\/:id$/).toString(),
			);
		});
	});

	describe("findRequest", () => {
		test("should find a request by URL", () => {
			const request = new Request("http://localhost/api/users");
			const mocked: MockArr = [/\/api\/users$/, DEFAULT_MOCK_OPTIONS];
			expect(findRequest([request.url])(mocked)).toEqual(true);
		});

		test("should find a request by URL and method", () => {
			const request = new Request("http://localhost/api/users", { method: "POST" });
			const mocked: MockArr = [/\/api\/users$/, { ...DEFAULT_MOCK_OPTIONS, method: "POST" }];
			expect(findRequest([request.url, { method: "POST" }])(mocked)).toEqual(
				true,
			);
		});

		test("should find a request by URL and headers", () => {
			const request = new Request("http://localhost/api/users", {
				headers: new Headers({ "x-foo-bar": "baz" }),
			});
			const mocked: MockArr = [
				/\/api\/users$/,
				{ ...DEFAULT_MOCK_OPTIONS, headers: new Headers({ "x-foo-bar": "baz" }) },
			];
			expect(
				findRequest([request.url, { headers: new Headers({ "x-foo-bar": "baz" }) }])(
					mocked,
				),
			).toEqual(true);
		});

		test("should not find a request by URL if the method does not match", () => {
			const request = new Request("http://localhost/api/users", { method: "GET" });
			const mocked: MockArr = [/\/api\/users$/, DEFAULT_MOCK_OPTIONS];
			expect(findRequest([request.url, { method: "POST" }])(mocked)).toEqual(
				false,
			);
		});

		test("should not find a request by URL if the headers do not match", () => {
			const request = new Request("http://localhost/api/users", {
				headers: new Headers({ "x-foo-bar": "baz" }),
			});
			const mocked: MockArr = [/\/api\/users$/, DEFAULT_MOCK_OPTIONS];
			expect(
				findRequest([request.url, { headers: new Headers({ "x-foo-bar": "baz" }) }])(
					mocked,
				),
			).toEqual(false);
		});
	});

	describe("makeResponse", () => {
		test("should return a Response object", () => {
			const response = makeResponse(200);
			expect(response.ok).toEqual(true);
			expect(response.status).toEqual(200);
			expect(response.headers).toBeInstanceOf(Headers);
			expect(response.redirected).toEqual(false);
			expect(response.bodyUsed).toEqual(false);
		});

		test("should return a Response object with data", async () => {
			const response = makeResponse(200, {
				response: { data: { foo: "bar" } },
			});
			expect(await response.json()).toEqual({ foo: "bar" });
		});

		test("should return a Response object with headers", () => {
			const response = makeResponse(200, {
				response: { headers: new Headers({ "x-foo-bar": "baz" }) },
			});
			expect(response.headers.get("x-foo-bar")).toEqual("baz");
		});
	});
});
