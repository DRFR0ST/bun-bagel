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
