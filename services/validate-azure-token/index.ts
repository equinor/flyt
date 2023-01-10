import jwt, { VerifyOptions } from "jsonwebtoken";
import { getMatchingKey } from "./getMatchingKey";

/**
 * Validate your Azure Bearer Token
 * @param token Without the Bearer text
 * @param verifyOptions
 * @returns {*}
 */
const validateToken = async (
  token: string,
  verifyOptions: VerifyOptions | undefined
): Promise<string | unknown> => {
  return new Promise(async (resolve, reject) => {
    if (!token) return reject("Missing JWT token");

    const matchingKey = await getMatchingKey(token);
    if (!matchingKey) return reject("Token does not match keys");

    const publicKeyCertificate =
      // deepcode ignore HardcodedSecret: Public keys are designed for sharing
      "-----BEGIN CERTIFICATE-----\n" +
      matchingKey.x5c +
      "\n-----END CERTIFICATE-----";

    if (verifyOptions) {
      jwt.verify(token, publicKeyCertificate, verifyOptions, (err) => {
        err ? reject(err.message) : resolve(true);
      });
    } else {
      jwt.verify(token, publicKeyCertificate, (err) => {
        err ? reject(err.message) : resolve(true);
      });
    }
  });
};

export default validateToken;
