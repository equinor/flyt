// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require("next-remove-imports")();

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

module.exports = removeImports({
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
  devIndicators: false,
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
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  poweredByHeader: false,
});
