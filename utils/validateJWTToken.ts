import getConfig from "next/config";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";

let possibleKeys;

async function getMatchingKey(
  token: string
): Promise<{ x5c: string; x5t: string }> {
  if (!token) return null;
  // We probably don't need to do this for every request... so let's cache it!
  if (!possibleKeys) {
    // Get keys from microsoft
    const request = await fetch(
      "https://login.microsoftonline.com/common/discovery/keys"
    );
    const data = await request.json();
    possibleKeys = data.keys.map((key) => ({
      x5c: key.x5c,
      x5t: key.x5t,
    }));
  }
  const jwtTokenHeader = JSON.parse(atob(token.split(".")[0]));
  // Cross-Reference Azure AD-Issued Token to get the Correct Public Key
  return possibleKeys.find((key) => key.x5t === jwtTokenHeader.x5t);
}

//Validate JWTToken against Azure
export const validateJWTToken = async (token: string): Promise<void> => {
  const { serverRuntimeConfig } = getConfig();
  return new Promise(async (resolve, reject) => {
    if (!token) {
      return reject("Missing JWT token");
    }
    const matchingKey = await getMatchingKey(token);
    if (!matchingKey) {
      return reject("Token does not match keys");
    }
    const publicKey =
      "-----BEGIN CERTIFICATE-----\n" +
      matchingKey.x5c +
      "\n-----END CERTIFICATE-----";
    const verifyOptions = {
      algorithms: ["RS256"],
      audience: serverRuntimeConfig.AUDIENCE,
      issuer: "https://sts.windows.net/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/",
    };
    jwt.verify(token, publicKey, verifyOptions, (err: ExtendedError) => {
      if (err) {
        return reject(err.message);
      } else {
        return resolve();
      }
    });
  });
};
