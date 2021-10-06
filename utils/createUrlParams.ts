/**
 * Create url-params from a key:value set
 * @param params
 */
export function createUrlParams(params: {
  [x: string]: string | string[] | number | boolean;
}): string {
  if (!params) return "";
  return Object.keys(params)
    .map((key, index) => {
      const prefix = index === 0 ? `?` : `&`;
      return `${prefix}${key}=${params[key]}`;
    })
    .join("");
}
