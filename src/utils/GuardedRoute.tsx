import { Redirect, Route } from "react-router-dom";
import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useLocation } from "react-router";

export function GuardedRoute(props: {
  path: string;
  component: any;
  // isAuthenticated: boolean;
}): JSX.Element {
  const { path, component: Component, ...rest } = props;
  //TODO: Fix auth guard. Also there's a registered issue on GitHub for this https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2846
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  return (
    <Route
      path={path}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              hash: `${location.pathname}${location.search}`,
            }}
          />
        )
      }
      {...rest}
    />
  );
}
