/**
 * Create url-params from a key:value set
 * @param params
 */
export function createUrlParams(params: {
  [x: string]: string | number | boolean | Array<string | number | boolean>;
}): string {
  // If no params, return empty string
  if (!params) return "";

  // Create a string of params
  return (
    `?` +
    Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&")
  );
}
