/**
 * Get REACT_APP_API_SCOPE environment variable
 */
export default function getAPIScope(): string {
  if (process.env.REACT_APP_API_SCOPE) return process.env.REACT_APP_API_SCOPE;
  throw new Error("MISSING ENV VAR: REACT_APP_API_SCOPE");
}
