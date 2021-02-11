module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_NAME: process.env.APP_NAME,
    ENVIRONMENT: process.env.ENVIRONMENT,
    API_BASEURL: process.env.API_BASEURL,
    SCOPE: process.env.SCOPE,
    CLIENT_ID: process.env.CLIENT_ID,
    AUTHORITY: process.env.AUTHORITY
  },
};
