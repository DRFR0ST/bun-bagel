import { mock } from '../dist/index';

const MOCK_FETCH = true;

// Fetch data

const url = "https://dummyjson.com/test";

const method = "POST";
const headers = new Headers({ "x-foo-bar": "baz" });
const data = { foo: "bar" };

// Mock fetch
let mockInstance;
if (MOCK_FETCH)
    mockInstance = mock(url, { method, headers, data });

// Call fetch method

const response = await fetch(url, { method, headers });
console.log("Response =>", response);

const body = await response.json();
console.log("Body =>", body);

if(mockInstance) {
    console.log("Mock Called =>", mockInstance.called);

    mockInstance.clear();

    // Fetch again to confirm the mock was cleared.
    const response = await fetch(url, { method, headers });
    console.log("Cleared Response =>", response);

    const body = await response.json();
    console.log("Cleared Body =>", body);
}