import { getConfig } from "./getConfig";

export interface IConfig {
  CLIENT_ID: string;
}

export default function getClientId(): string {
  if (process.env.NODE_ENV === "development") {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    if (!clientId) {
      throw Error("REACT_APP_CLIENT_ID missing from environment");
    }
    return clientId;
  } else {
    return getConfig("REACT_APP_CLIENT_ID");
  }
}
