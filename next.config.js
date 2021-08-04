module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_BASEURL: process.env.API_BASEURL,
    API_HUB_URL: process.env.API_HUB_URL,
    AUTHORITY: process.env.AUTHORITY,
    CLIENT_ID: process.env.CLIENT_ID,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SCOPE: process.env.SCOPE,
  },
};
