import { mock } from '../dist/index';

const MOCK_FETCH = true;

// Fetch data

const url = "https://dummyjson.com/test";

const method = "POST";
const headers = new Headers({ "x-foo-bar": "baz", "Content-Type": "application/json" });
// const data = { "status":"ok", "method":"POST" };
// const data = new Blob(["Hello World"]);
const data = Bun.file("./sandbox/dummy.json");

// Mock fetch

if (MOCK_FETCH)
    mock(url, { method, headers, data });

// Call fetch method

const response = await fetch(url, { method, headers });
console.log("Response =>", response);

const body = await response.blob();
console.log("Body =>", body, await body.json());