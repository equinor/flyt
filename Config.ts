import getConfig from "next/config";

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: publicRuntimeConfig.CLIENT_ID,
    authority: publicRuntimeConfig.AUTHORITY
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: [publicRuntimeConfig.SCOPE]
};

export const APIConfigs = {
  url: publicRuntimeConfig.API_BASEURL
};
