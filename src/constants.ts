import type { MockOptions } from "./types";

/**
 * The default value for mock options.
 */
export const DEFAULT_MOCK_OPTIONS: MockOptions = {
	method: "GET",
	data: null,
	headers: new Headers(),
	response: {
		data: null,
		headers: new Headers(),
		status: 200,
	},
};
