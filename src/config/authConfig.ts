import { Configuration, PopupRequest } from "@azure/msal-browser";
import getClientId from "../utils/getClientId";
import getAPIScope from "../utils/getAPIScope";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: getClientId(),
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};
// Our App specific API scope
export const apiScopes: PopupRequest = {
  scopes: [getAPIScope()],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
