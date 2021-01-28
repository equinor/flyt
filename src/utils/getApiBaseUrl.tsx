import { getConfig } from "./getConfig";

export default function getApiBaseUrl(): string {
  // If we are not in prod, we use the proxy defined in package.json instead of the env variable.
  // This fixes cors issues, since the browser now asks localhost for the api-request.
  if (process.env.NODE_ENV === "production") {
    // Use NGINX proxy
    return "/api-proxy";
  }
  return "";
}
