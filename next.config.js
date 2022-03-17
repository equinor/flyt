module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    AUTH_SECRET: process.env.AUTH_SECRET, // "authentication secret or public key, used for validating user requests in pages/api",
    AUDIENCE: process.env.AUDIENCE,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_BASEURL: process.env.API_BASEURL,
    API_HUB_URL: process.env.API_HUB_URL,
    AUTHORITY: process.env.AUTHORITY,
    CLIENT_ID: process.env.CLIENT_ID,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SCOPE: process.env.SCOPE,
    RADIX_GIT_COMMIT_HASH: process.env.RADIX_GIT_COMMIT_HASH,
  },
  async redirects() {
    return [
      {
        source: "/projects/:path*",
        destination: "/process/:path*",
        permanent: false,
      },
    ];
  },
  optimizeFonts: false,
};
