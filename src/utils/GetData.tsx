import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { apiScopes } from "../config/authConfig";
import { fetchData } from "./fetchData";

export function getData(
  url: string,
  useAccount: AccountInfo,
  useInstance: IPublicClientApplication,
  callback: { (response: any): void; (arg0: any): void }
): void {
  if (useAccount) {
    useInstance
      .acquireTokenSilent({ ...apiScopes, account: useAccount })
      .then(({ accessToken }) => {
        fetchData(accessToken, url).then((response) => {
          if (callback) {
            callback(response);
          }
        });
      });
  }
}
