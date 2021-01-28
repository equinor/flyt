export default function getApiBaseUrl(): string {
  // If we are not in prod, we use the proxy defined in package.json instead of the env variable.
  // This fixes cors issues, since the browser now asks localhost for the api-request.
  if (process.env.NODE_ENV !== "production") return "";
  if (process.env.REACT_APP_API_BASE_URL)
    return process.env.REACT_APP_API_BASE_URL;
  throw new Error("MISSING ENV VAR: REACT_APP_API_BASE_URL");
}
