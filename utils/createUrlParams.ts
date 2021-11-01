/**
 * Create url-params from a key:value set
 * @param params
 */
export function createUrlParams(params: {
  [x: string]: string | number | boolean;
}): string {
  if (!params) return "";
  let first = true;
  return Object.keys(params)
    .map((key) => {
      // Do not add the key-value-pair if the value is empty
      if (!params[key]) return "";

      // If this is the first key-value-pair added, prefix with "?".
      const prefix = first ? `?` : `&`;
      if (first) first = false;

      // Return prefixed key with url-encoded values
      return `${prefix}${key}=${encodeURIComponent(params[key])}`;
    })
    .join("");
}
