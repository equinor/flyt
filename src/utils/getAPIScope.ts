import { getConfig } from "./getConfig";

/**
 * Get REACT_APP_API_SCOPE environment variable
 */
export default function getAPIScope(): string {
  if (process.env.NODE_ENV === "development") {
    const scope = process.env.REACT_APP_API_SCOPE;
    if (!scope) {
      throw Error("REACT_APP_API_SCOPE missing from environment");
    }
    return scope;
  } else {
    return getConfig("REACT_APP_API_SCOPE");
  }
}
