import React from "react";
import "./App.css";
import { MsalProvider } from "@azure/msal-react";
import { Icon } from "@equinor/eds-core-react";
import { msalConfig } from "./config/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import { AppRouter } from "./AppRouter";
import { account_circle, add } from "@equinor/eds-icons";

Icon.add({ account_circle, add });

export default function App(): JSX.Element {
  const msalInstance = new PublicClientApplication(msalConfig);

  return (
    <MsalProvider instance={msalInstance}>
      <AppRouter />
    </MsalProvider>
  );
}
