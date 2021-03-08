export const timeDefinitions = [
  { value: "minute", displayName: "Minute(s)" },
  { value: "Hour", displayName: "Hour(s)" },
  { value: "Day", displayName: "Day(s)" },
  { value: "Week", displayName: "Week(s)" },
  { value: "Month", displayName: "Month(s)" },
  { value: "Year", displayName: "Year(s)" },
  // { value: "m", displayName: "Minute(s)" },
  // { value: "H", displayName: "Hour(s)" },
  // { value: "D", displayName: "Day(s)" },
  // { value: "W", displayName: "Week(s)" },
  // { value: "M", displayName: "Month(s)" },
  // { value: "Y", displayName: "Year(s)" },
];

export const getTimeDefinitionValues = (): Array<string> =>
  timeDefinitions.map((item) => item.displayName);

export const getTimeDefinitionValue = (displayName: string): string =>
  timeDefinitions.find((item) => item.displayName === displayName).value;

export const getTimeDefinitionDisplayName = (value: string): string => {
  if (!value) return "";
  return timeDefinitions.find((item) => item.value === value).displayName;
};

export const formatDuration = (duration, timeDefinition) => {
  if (!duration || !timeDefinition) return "-";
  const unit =
    `${timeDefinition}`.charAt(0).toUpperCase() + `${timeDefinition}`.slice(1);
  return !!duration && duration !== 0
    ? duration === 1
      ? `1 ${unit}`
      : `${duration} ${unit}s`
    : "Duration?";
};
