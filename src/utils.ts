import { MockOptions } from "./types";

/**
 * @description Convert a wildcard string to a regular expression.
 * @param wildcardString - The wildcard string to convert. eg. '/api/*\/users'
 * @returns A regular expression that matches the wildcard string.
 */
export function wildcardToRegex(wildcardString: string): RegExp {
    // Escape special regex characters
    const escapedString = wildcardString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Convert wildcard stars to regex patterns
    const regexPattern = escapedString.replace(/\\\*/g, "[\\s\\S]*");

    // Anchor pattern for strict path matching
    const anchoredPattern = `${regexPattern}$`;

    return new RegExp(anchoredPattern);
}

/**
 * @description Find a requests.
 */
export const findRequest = (original: [string, RequestInit?]) => (mocked: [RegExp, MockOptions?]) => {
    const [keyA, optionsA] = original;
    const [keyB, optionsB] = mocked;

    // Match keys.
    const keysMatch = keyA.toString() === keyB.toString() || keyA.match(keyB);

    if(!keysMatch)
        return false;

    // Match methods.
    const methodA = optionsA?.method || "GET";
    const methodB = optionsB?.method || "GET";

    const methodMatch = methodA.toLowerCase() === methodB.toLowerCase();

    if(!methodMatch)
        return false;

    // Match headers.
    const headersA = new Headers(optionsA?.headers);
    const headersB = new Headers(optionsB?.headers);

    const headersMatch = Object.keys(headersB).every(key => {
        const valueA = headersA.get(key);
        const valueB = headersB.get(key);

        return valueA === valueB;
    });

    if(!headersMatch)
        return false;

    return true;
}
        
