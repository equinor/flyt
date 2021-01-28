import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { Button } from "@equinor/eds-core-react";
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

/**
 * Sign in if you are not signed in.
 * And sign out if you are...
 *
 * "Sign in"-button navigates the user to the loginPage that will redirect back after successful auth.
 * @constructor
 */
export function SignInSignOutButton(): JSX.Element {
  const { instance } = useMsal();
  const location = useLocation();
  return (
    <>
      <AuthenticatedTemplate>
        <Button variant="outlined" onClick={() => instance.logout()}>
          Sign Out
        </Button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Link
          to={{
            pathname: "/login",
            hash: `${location.pathname}${location.search}`,
          }}
        >
          <Button variant={"contained"}>Sign in</Button>
        </Link>
      </UnauthenticatedTemplate>
    </>
  );
}
