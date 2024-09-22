# 🥯 bun-bagel: The Bun fetch mocker with a hole lot of flavor.

[![npm version](https://badge.fury.io/js/bun-bagel.svg)](https://www.npmjs.com/package/bun-bagel)
[![GitHub license](https://img.shields.io/github/license/DRFR0ST/bun-bagel)](https://github.com/DRFR0ST/bun-bagel/blob/main/LICENSE)
[![🧪 Tests](https://github.com/DRFR0ST/bun-bagel/actions/workflows/test.yml/badge.svg)](https://github.com/DRFR0ST/bun-bagel/actions/workflows/test.yml)

---

**bun-bagel** is a mocking library specifically designed for [Bun's fetch](https://bun.sh/guides/http/fetch) API. It enables developers to easily intercept fetch requests and provide custom mock responses, streamlining the development and testing process of Bun applications.

:warning: The library is yet only experimental and might change over time. 

## 📖 Usage

```ts
import { mock } from "bun-bagel";

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

### Mock by headers and method
```ts
import { mock } from "bun-bagel";
import type { MockOptions } from "bun-bagel";

const options: MockOptions = {
    method: "POST",
    headers: { "x-foo-bar": "baz" },
    response: {
        data: { name: "Foo" },
    }
};

// Register the mock for the example URL.
mock("https://example.com/api/users/*", options);

// Make a fetch request to the mocked URL
const response = await fetch("https://example.com/api/users/123", { headers: { "x-foo-bar": "baz" } });

// Requests without the headers will not be matched.
const response2 = await fetch("https://example.com/api/users/123");

// Check the response body.
console.log(await response.json()); // => { name: "Foo" }
```

### Mock response status and headers
```ts
import { mock } from "bun-bagel";
import type { MockOptions } from "bun-bagel";

const options: MockOptions = {
    response: {
        data: { name: "Foo" },
        status: 404,
        headers: { "x-foo-bar": "baz" },
    }
};

// Register the mock for the example URL.
mock("https://example.com/api/users/*", options);

// Make a fetch request to the mocked URL
const response = await fetch("https://example.com/api/users/123");

// Check the status and headers.
console.log(response.status); // => 404
console.log(response.headers); // => { "x-foo-bar": "baz" }
```

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## 🔨 Development

To contribute to bun-bagel, follow these steps:

1. Clone the repository: `git clone https://github.com/DRFR0ST/bun-bagel.git`
2. Install dependencies: `bun install`
3. Run tests: `bun test`
4. Run linter & formatter: `bun run check`
5. Build the library: `bun run build`

> [!NOTE]
>You can also play around with bun-bagel by making changes in the `/sandbox` directory and running `bun run sandbox`. Make sure to build the library after making changes in the `/src` directory.

## 🤝 Community

Join the discussion on the [GitHub Discussions](https://github.com/DRFR0ST/bun-bagel/discussions) page.

## 📝 License
This project is licensed under the terms of the MIT license. See the [LICENSE](https://github.com/DRFR0ST/bun-bagel/blob/main/LICENSE) file for details.

#### 📢 Thanks to all contributors for making this library better!
#### 🤖 Thanks to Gemini for generating a part of the initial code and readme, and helped brainstorm the idea.