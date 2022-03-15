//Get DateTime Option for a given resolution
export function getDateTimeOption(
  resolution: "year" | "month" | "day" | "hour" | "minute" | "second" | string
): Intl.DateTimeFormatOptions {
  if (resolution === "year") {
    // yyyy
    return { year: "numeric" };
  } else if (resolution === "month") {
    // mm.yyyy
    return { year: "numeric", month: "2-digit" };
  } else if (resolution === "day") {
    // dd.mm.yy
    return { year: "2-digit", month: "2-digit", day: "2-digit" };
  } else if (resolution === "hour") {
    // dd.mm.yy hh
    return {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
    };
  } else if (resolution === "minute") {
    // dd.mm.yy hh:mm
    return {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
  } else if (resolution === "second") {
    // dd.mm.yy hh:mm:ss
    return {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
  }
  throw new Error(`Unknown resolution: ${resolution}`);
}
