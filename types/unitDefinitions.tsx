export const timeDefinitions = [
  { value: "Minute", displayName: "Minute(s)", duration: 0 },
  { value: "Hour", displayName: "Hour(s)", duration: 0 },
  { value: "Day", displayName: "Day(s)", duration: 0 },
  { value: "Week", displayName: "Week(s)", duration: 0 },
  { value: "Month", displayName: "Month(s)", duration: 0 },
  { value: "Year", displayName: "Year(s)", duration: 0 },
];

export const getTimeDefinitionValues = (): Array<string> =>
  timeDefinitions.map((item) => item.displayName);

export const getTimeDefinitionValue = (displayName: string) =>
  timeDefinitions.find((item) => item?.displayName === displayName)?.value ||
  null;

export const getTimeDefinitionDisplayName = (value: string) =>
  timeDefinitions.find((item) => item.value === value)?.displayName || "";

/**
 * Capitalize the first letter and lowercase the rest.
 * @param s
 */
const capitalizeFirstLetter = (s: string): string =>
  `${s}`.charAt(0).toUpperCase() + `${s}`.slice(1).toLowerCase();

const getShortDisplayName = (displayName: string) =>
  displayName.slice(0, displayName === "Month(s)" ? 2 : 1).toLocaleLowerCase();

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
export const formatDuration = (
  duration?: number | null,
  unit?: string | null
): string => {
  if (typeof duration !== "number" || !unit) return "";
  const cUnit = capitalizeFirstLetter(unit);
  return `${duration} ${cUnit}s`;
};

export const formatDurationSum = (
  duration?: typeof timeDefinitions
): string => {
  if (!duration) return "";
  let sumDuration = "";
  const reversedDuration = [...duration].reverse();
  reversedDuration?.forEach((d) => {
    if (d.duration !== 0) {
      const cUnit = getShortDisplayName(d.displayName);
      sumDuration += `${d.duration}${cUnit} `;
    }
  });
  return sumDuration;
};
