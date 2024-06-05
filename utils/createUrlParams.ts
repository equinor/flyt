/**
 * Create url-params from a key:value set
 * @param params
 */
export function createUrlParams(params: {
  [x: string]: string | number | boolean | (string | number | boolean)[];
}): string {
  // If no params, return empty string
  if (!params) return "";

  // Create a string of params
  return (
    (
      `?` +
      Object.keys(params).map((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${encodeURIComponent(v)}`);
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
    )
      .split(",") // Make an array
      .filter((v) => v) // Remove empty strings
      // remove duplicates
      .reduce((acc: string[], curr) => {
        if (acc.indexOf(curr) < 0) {
          acc.push(curr);
        }
        return acc;
      }, [])
      .join("&") // Join array with `&` (string concatenation)
  );
}
