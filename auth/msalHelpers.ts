import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "../Config";

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;

export async function getAccessToken(): Promise<string> {
  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: msalInstance.getAllAccounts()[0],
      scopes: loginRequest.scopes,
      authority: msalConfig.auth.authority,
    });
    return `Bearer ${tokenResponse.accessToken}`;
  } catch (e) {
    throw Error(e);
  }
}
