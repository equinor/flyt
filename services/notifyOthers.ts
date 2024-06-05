import { AccountInfo } from "@azure/msal-browser";
import { getUserShortName } from "@/utils/getUserShortName";
import { getAccessToken } from "@/auth/msalHelpers";

export const notifyOthers = async (
  msg: unknown,
  roomId: string | string[],
  account?: AccountInfo | null
) => {
  // build message obj
  const message = {
    msg,
    roomId,
    user: account ? getUserShortName(account) : "",
  };

  if (account) message["user"] = getUserShortName(account);

  // dispatch message to other users
  await fetch("/api/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await getAccessToken(),
    },
    body: JSON.stringify(message),
  });
};
