import { NodeData } from "@/types/NodeData";
import { TimeDefinition } from "@/types/TimeDefinition";
import { capitalizeFirstLetter } from "./stringHelpers";

export const timeDefinitions: TimeDefinition[] = [
  { value: "Second", displayName: "Second(s)", duration: null },
  { value: "Minute", displayName: "Minute(s)", duration: null },
  { value: "Hour", displayName: "Hour(s)", duration: null },
  { value: "Day", displayName: "Day(s)", duration: null },
  { value: "Week", displayName: "Week(s)", duration: null },
  { value: "Month", displayName: "Month(s)", duration: null },
  { value: "Year", displayName: "Year(s)", duration: null },
];

export const getDurationInSeconds = (value: string, duration: number) => {
  switch (value) {
    case "Second":
      return duration;
    case "Minute":
      return duration * 60;
    case "Hour":
      return duration * 3600;
    case "Day":
      return duration * 86400;
    case "Week":
      return duration * 604800;
    case "Month":
      return duration * 2592000;
    case "Year":
      return duration * 31556952;
    default:
      return duration;
  }
};

export const getTimeDefinitionDisplayNames = (): Array<string> =>
  timeDefinitions.map((item) => item.displayName);

export const getTimeDefinitionValue = (displayName: string) =>
  timeDefinitions.find((item) => item?.displayName === displayName)?.value ||
  null;

export const getTimeDefinitionDisplayName = (value: string) =>
  timeDefinitions.find((item) => item.value === value)?.displayName || "";

const getShortDisplayName = (displayName: string) =>
  displayName.slice(0, displayName === "Month(s)" ? 2 : 1).toLowerCase();

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

const isOnlyZeroDurations = (timeDurations: TimeDefinition[]) =>
  timeDurations.every((td) => !td.duration || td.duration === 0);

export const formatTotalDuration = (
  timeDurations?: TimeDefinition[]
): string => {
  if (!timeDurations) return "";
  if (isOnlyZeroDurations(timeDurations)) return "0";

  let sumDuration = "";
  const reversedTimeDurations = timeDurations.slice().reverse();

  reversedTimeDurations?.forEach((d) => {
    if (d.duration) {
      const cUnit = getShortDisplayName(d.displayName);
      sumDuration += `${d.duration}${cUnit} `;
    }
  });

  return sumDuration.trim();
};

export const formatMinMaxTotalDuration = (
  totalDurations: NodeData["totalDurations"]
) => {
  const minTotalDuration = formatTotalDuration(
    totalDurations?.minTotalDuration
  );
  const maxTotalDuration = formatTotalDuration(
    totalDurations?.maxTotalDuration
  );
  if (minTotalDuration === maxTotalDuration)
    return `Estimate: ${minTotalDuration}`;
  else
    return `Low estimate: ${minTotalDuration}\nHigh estimate: ${maxTotalDuration}`;
};

export const formatMinMaxTotalDurationShort = (
  totalDurations: NodeData["totalDurations"]
) => {
  const minTotalDuration = formatTotalDuration(
    totalDurations?.minTotalDuration
  );
  const maxTotalDuration = formatTotalDuration(
    totalDurations?.maxTotalDuration
  );
  if (minTotalDuration === maxTotalDuration) return minTotalDuration;
  return `${minTotalDuration} - ${maxTotalDuration}`;
};
