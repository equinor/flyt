/**
 * Capitalize the first letter and lowercase the rest.
 * @param s
 */
export const capitalizeFirstLetter = (s: string): string =>
  `${s}`.charAt(0).toUpperCase() + `${s}`.slice(1).toLowerCase();

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
