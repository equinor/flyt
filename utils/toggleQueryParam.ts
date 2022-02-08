import { NextRouter } from "next/router";

/**
 * Toggle a query param in the current URL.
 *
 * Adds or removes the query param from the URL.
 * If the query param is already in the URL, it is removed.
 * If the query param is not in the URL, it is added.
 * @param key
 * @param value
 * @param router
 */
export function toggleQueryParam(
  key: string,
  value: string,
  router: NextRouter
) {
  const query = router.query;
  const newQuery = { ...query };

  // If key is empty, add it together with the value
  if (!query[key]) newQuery[key] = [value];

  // If it does exist, either remove it or add a new one
  if (query[key]) {
    const currentQueryParam = query[key].toString().split(","); // an array is easier to work with..

    // If the query param is already in the URL, remove it.
    // Else, add it.
    if (currentQueryParam.some((v) => v == value)) {
      newQuery[key] = currentQueryParam.filter((item) => item != value);
    } else {
      newQuery[key] = [...currentQueryParam, value];
    }
  }

  // Update the URL.
  router.replace({
    query: newQuery,
  });
}
