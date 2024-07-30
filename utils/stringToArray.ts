/**
 * Helper function to convert a string to an array of strings.
 *
 * (Next.js query values are either a string or an array of strings.)
 * @param stringOrArray - string or array of strings
 * @returns - array of strings
 */
export function stringToArray(
  stringOrArray: string | string[] | undefined
): string[] {
  if (!stringOrArray) return [];
  return stringOrArray?.toString().split(",");
}
