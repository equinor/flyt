import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
export const nextConfig = {
  serverRuntimeConfig: {
    AUTH_SECRET: serverRuntimeConfig.AUTH_SECRET, // "authentication secret or public key, used for validating user requests in pages/api",
    AUDIENCE: serverRuntimeConfig.AUDIENCE,
  },
};
