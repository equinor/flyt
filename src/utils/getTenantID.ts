import { getConfig } from "./getConfig";

/**
 * Get REACT_APP_TENANT_ID environment variable
 */
export default function getTenantID(): string {
  if (process.env.NODE_ENV === "development") {
    const tenantID = process.env.REACT_APP_TENANT_ID;
    if (!tenantID) {
      throw Error("REACT_APP_TENANT_ID missing from environment");
    }
    return tenantID;
  } else {
    return getConfig("REACT_APP_TENANT_ID");
  }
}
