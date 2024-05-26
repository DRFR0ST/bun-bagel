# 🥯 bun-bagel: The Bun fetch mocker with a hole lot of flavor.

[![npm version](https://badge.fury.io/js/bun-bagel.svg)](https://www.npmjs.com/package/bun-bagel)
[![GitHub license](https://img.shields.io/github/license/DRFR0ST/bun-bagel)](https://github.com/DRFR0ST/bun-bagel/blob/main/LICENSE)
[![🧪 Tests](https://github.com/DRFR0ST/bun-bagel/actions/workflows/test.yml/badge.svg)](https://github.com/DRFR0ST/bun-bagel/actions/workflows/test.yml)

---

**bun-bagel** is a mocking library specifically designed for [Bun's fetch](https://bun.sh/guides/http/fetch) API. It enables developers to easily intercept fetch requests and provide custom mock responses, streamlining the development and testing process of Bun applications.

:warning: The library is yet only experimental and might change over time. 

## 📖 Usage

```ts
import { mock, clearMocks } from "bun-bagel";

// Register the mock for the example URL.
mock("https://example.com/api/users/*", { data: { name: "Foo" } });

// Make a fetch request to the mocked URL
const response = await fetch("https://example.com/api/users/123");

// Print the response body
console.log(await response.json());
```

#### Output:

```
{ name: "Foo" }
```

## 🚀 Why bun-bagel?

- **Lightweight and easy to use**: Get started in minutes with a simple, intuitive API.
- **Flexible and powerful**: Handle a wide range of mocking scenarios with ease.
- **Built for Bun**: Seamlessly integrates with Bun's runtime for a smooth developer experience.
- **Thoroughly tested**: Comes with a comprehensive test suite to ensure reliability.

## 📚 Installation

`bun install bun-bagel`

## 🧪 Examples

### Bun Unit Tests
```ts
import { describe, test, expect, afterEach } from "bun:test";
import { mock, clearMocks } from "bun-bagel";

describe("Unit Test", () => {

    afterEach(() => {
        clearMocks();
    });

    test("Mock Fetch", async () => {
        // Register the mock for the example URL.
        mock("https://example.com/api/users/*", { data: { name: "Foo" } });

        // Call a function that uses the fetch method.
        const response = await fetchSomeData();

        // Print the response body
        console.log(await response.json()); // => { name: "Foo" }
    });
});

```

## 📝 License
This project is licensed under the terms of the MIT license. See the LICENSE file for details.

#### 🤖 Thanks to Gemini for generating most of this code and readme.