// @ts-nocheck

import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "../Config";

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;

export async function getAccessToken() {
  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: msalInstance.getActiveAccount(),
      scopes: loginRequest.scopes,
      authority: msalConfig.auth.authority
    });
    return `Bearer ${tokenResponse.accessToken}`;
  } catch (e) {
    throw new Error(e);
  }
}
