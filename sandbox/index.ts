import { mock, HttpStatusCode } from '../dist/index';

const MOCK_FETCH = true;

// Fetch data

const url = "https://dummyjson.com/test";

const method = "POST";
const headers = new Headers({ "x-foo-bar": "baz" });
const data = { foo: "bar" };

// Mock fetch

if (MOCK_FETCH)
    mock(url, { method, headers, data, status: HttpStatusCode.I_AM_A_TEAPOT });

// Call fetch method

const response = await fetch(url, { method, headers });
console.log("Response =>", response);
console.log("Status =>", response.status);

const body = await response.json();
console.log("Body =>", body);