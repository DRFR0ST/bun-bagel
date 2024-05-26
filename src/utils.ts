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
 * @description Find requests.
 */
export const findRequest = (original: [string, any]) => (mocked: [RegExp, any]) => {
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
    const headersA = optionsA?.headers || {};
    const headersB = optionsB?.headers || {};

    const headersMatch = Object.entries(headersB).every(([key]) => {
        const headerValueA = headersA[key];
        const headerValueB = headersB[key];

        return headerValueA === headerValueB;
    });

    if(!headersMatch)
        return false;

    return true;
}

// Old code logic
// ([key, options]) =>
//             _path instanceof RegExp ? _path === key : _path.match(key)?.[0]
//             && (options.method && options.method?.toLowerCase() === _method?.toLowerCase())
        
