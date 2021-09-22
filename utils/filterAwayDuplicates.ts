/**
 * Filter that removes duplicates from array
 *
 * ref https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
 * @param value
 * @param index
 * @param array
 */
export const filterAwayDuplicates = (value, index, array) => {
  // Checks if the given value is the first occurring.
  // If not, it must be a duplicate and should be excluded.
  return array.indexOf(value) === index;
};
