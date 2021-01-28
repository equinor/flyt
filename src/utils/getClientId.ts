/**
 * Get REACT_APP_CLIENT_ID environment variable
 */
export default function getClientId(): string {
  console.log(
    process.env,
    process.env.REACT_APP_CLIENT_ID,
    process.env.REACT_APP_API_BASE_URL,
    process.env.REACT_APP_API_SCOPE,
    process.env.REACT_APP_VERSION
  );
  if (process.env.REACT_APP_CLIENT_ID) return process.env.REACT_APP_CLIENT_ID;
  throw new Error("MISSING ENV VAR: REACT_APP_CLIENT_ID");
}
