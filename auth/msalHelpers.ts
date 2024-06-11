import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "@/Config";

export const msalInstance = new PublicClientApplication(msalConfig);

export async function getAccessToken(): Promise<string> {
  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: msalInstance.getAllAccounts()[0],
      scopes: loginRequest.scopes,
      authority: msalConfig.auth.authority,
    });
    return `Bearer ${tokenResponse.accessToken}`;
  } catch (e: any) {
    if (e.errorCode === "monitor_window_timeout")
      await msalInstance.logoutRedirect();
    throw Error(e);
  }
}
