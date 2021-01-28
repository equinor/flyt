import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import React from "react";
import { AppTopBar } from "../components";

export function HomePage(): JSX.Element {
  return (
    <>
      <AppTopBar />
      <div
        className={"appear"}
        style={{
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <AuthenticatedTemplate>
          <h1>Welcome to VSM</h1>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <h1>You are not logged in</h1>
        </UnauthenticatedTemplate>
      </div>
    </>
  );
}
