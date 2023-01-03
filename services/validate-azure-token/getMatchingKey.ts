import fetch from "node-fetch";
import { atob } from "./atob";

let possibleKeys: { x5c: string; kid: string }[] = [];
// This list is probably only correct for 24 hours. Let's clear the cache every 12 hours to be on the safe side...
setInterval(() => (possibleKeys = []), 1000 * 60 * 60 * 12);

/**
 * Get the public key that fits the given token.
 * @param token
 */
export async function getMatchingKey(
  token: string
): Promise<{ x5c: string; kid: string } | undefined> {
  // We probably don't need to do this for every request... so let's cache it!
  if (possibleKeys.length === 0) {
    // Get keys from microsoft
    const request = await fetch(
      "https://login.microsoftonline.com/common/discovery/keys"
    );
    const data = await request.json();
    possibleKeys = data.keys.map((key: { x5c: string; kid: string }) => ({
      x5c: key.x5c,
      kid: key.kid,
    }));
  }
  const jwtTokenHeader = JSON.parse(atob(token.split(".")[0]));
  // Cross-Reference Azure AD-Issued Token to get the Correct Public Key
  return possibleKeys.find((key) => key.kid === jwtTokenHeader.kid);
}
