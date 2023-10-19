const units = [
  { value: "Minute", displayName: "Minute(s)" },
  { value: "Hour", displayName: "Hour(s)" },
  { value: "Day", displayName: "Day(s)" },
  { value: "Week", displayName: "Week(s)" },
  { value: "Month", displayName: "Month(s)" },
  { value: "Year", displayName: "Year(s)" },
];

export const getUnitValues = (): string[] =>
  units.map((item) => item.displayName);

export const getUnitValue = (displayName: string): string =>
  units.find((item) => item.displayName === displayName).value;

export const getUnitDisplayName = (value: string): string => {
  if (!value) return "";
  return units.find((item) => item.value === value).displayName;
};

/**
 * Capitalize the first letter and lowercase the rest.
 * @param s
 */
const capitalizeFirstLetter = (s: string): string =>
  `${s}`.charAt(0).toUpperCase() + `${s}`.slice(1).toLowerCase();

/**
 * Format a duration and unit into a human readable format.
 *
 * Basically; Adds an 's' to the unit if it should be in plural form.
 * - 1 minute => 1 minute
 * - 2 minutes => 2 minutes
 * - Etc...
 *
 * @param duration
 * @param unit
 */
export const formatDuration = (duration: number, unit: string): string => {
  if (!duration || !unit) return "";
  const cUnit = capitalizeFirstLetter(unit);
  return duration === 1 ? `1 ${cUnit}` : `${duration} ${cUnit}s`;
};
