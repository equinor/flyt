import { queryObject } from "interfaces/queryObject";

/**
 * Combines new and existing query params, removing empty key-value pairs when no value is provided for a given query params. If only one argument is provided, removes empty key-value pairs.
 * @param currentParams : existing query parameters
 * @param newParams : new query parameters
 * @returns : updated query parameters with no empty key-value pairs
 */

export function getQueryObject(
  currentParams: queryObject,
  newParams?: queryObject
): queryObject {
  const combinedParams = { ...currentParams, ...newParams };
  const combinedParamsFormatted = {};

  for (const [objectKey, objectValue] of Object.entries(combinedParams)) {
    if (objectValue) {
      Object.defineProperty(combinedParamsFormatted, `${objectKey}`, {
        value: objectValue,
        writable: true,
        enumerable: true,
      });
    }
  }
  return combinedParamsFormatted;
}
