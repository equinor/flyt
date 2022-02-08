/**
 * Next.js router query params can be an array or a string or not exist at all.
 * So this is a helper function to get the number of query params without worrying about the type.
 * @param selectedQueryParam - The query string or array
 * @returns - The number of query params in the query string or array
 */
export function numberOfQueryParams(
  selectedQueryParam?: string | Array<string>
): number {
  if (!selectedQueryParam) return 0;
  const isString = typeof selectedQueryParam === "string";
  return isString ? 1 : selectedQueryParam.length;
}
