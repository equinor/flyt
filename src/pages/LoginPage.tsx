import React, { useEffect } from "react";
import { useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../config/authConfig";
import { Button } from "@equinor/eds-core-react";
import { SignInSignOutButton } from "../components/SignInSignOutButton";
import getTenantID from "../utils/getTenantID";

export const tenantSpecificEndpoint = `https://login.microsoftonline.com/${getTenantID()}`;

export function LoginPage() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const history = useHistory();

  const { result, error } = useMsalAuthentication(
    InteractionType.Redirect, //mobile doesn't like popup login
    {
      scopes: loginRequest.scopes,
      authority: tenantSpecificEndpoint,
    }
  );

  useEffect(() => {
    if (isAuthenticated && location.hash) {
      const redirectUrl = location.hash.split("#")[1];
      // navigate back to the page you came from
      history.push(`${redirectUrl}`);
    }
  }, [result, isAuthenticated, location.hash]);

  if (isAuthenticated) {
    return (
      <div className={"appear center"}>
        <h1>You are logged in</h1>
        {location.hash ? (
          <p className={"appear"}>
            Redirecting you to {location.hash.split("#")[1]}{" "}
          </p>
        ) : (
          <div className={"appear"}>
            <p>Could not redirect you</p>
            <Button variant={"contained"} onClick={() => history.push(`/`)}>
              Go home
            </Button>
          </div>
        )}
      </div>
    );
  }
  if (error)
    return (
      <div className={"center"}>
        <div className={"appear centerText"}>
          <h2>Failed to login</h2>
          <p>{JSON.stringify(error)}</p>
          <h2>Try to sign in manually</h2>
          <SignInSignOutButton />
        </div>
      </div>
    );
  return (
    <div className={"center appear"}>
      <h1>Logging you in</h1>
    </div>
  );
}
