import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { UserAuth } from "./UserPage";
import React from "react";
import { AppTopBar } from "../components";
import { Link } from "react-router-dom";

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
          <UserAuth />
        </UnauthenticatedTemplate>
        <p>
          Remember to say hi to the <Link to={"/rabbits"}>rabbits</Link>.
        </p>
        <p>
          Then go to the <Link to={"/vsm"}>VSMCanvasPage</Link>. (WIP)
        </p>
        <p>
          <Link to={"/overview"}>OverviewPage</Link>. (WIP)
        </p>
      </div>
    </>
  );
}
