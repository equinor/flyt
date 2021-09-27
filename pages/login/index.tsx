import { useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { loginRequest, msalConfig } from "../../Config";
import { InteractionType } from "@azure/msal-browser";
import commonStyles from "../../styles/common.module.scss";
import Link from "next/link";
import { Button, Typography } from "@equinor/eds-core-react";
import msalInstance from "../../auth/msalHelpers";

export default function LoginPage() {
  const isAuthenticated = useIsAuthenticated();
  const { asPath } = useRouter();
  const router = useRouter();
  const { error, result } = useMsalAuthentication(InteractionType.Redirect, {
    scopes: loginRequest.scopes,
    authority: msalConfig.auth.authority,
  });

  useEffect(() => {
    if (result) msalInstance.setActiveAccount(result.account);
  }, [result]);

  const sliceIndex = asPath.indexOf("=") + 1;
  const redirectUrl = asPath.slice(sliceIndex);

  useEffect(() => {
    if (isAuthenticated && !!redirectUrl) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div className={commonStyles.main}>
        <Typography variant={"h2"}>You are logged in</Typography>
        <Link href={"/"}>
          <Button>Go home</Button>
        </Link>
      </div>
    );
  }
  if (error)
    return (
      <div className={commonStyles.main}>
        <Typography variant={"h2"}>Failed to login</Typography>
        <div
          style={{
            margin: 12,
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "whitesmoke",
          }}
        >
          <h2 style={{ color: "black" }}>
            Include this message when reporting this error.
          </h2>
          <h3>Error: {error.errorCode}</h3>
          <p> {error.errorMessage}</p>
        </div>
      </div>
    );

  //Todo: If we are not being redirected to the msal-login-page for some reason. Clear all cookies and try again.
  return (
    <div className={commonStyles.main}>
      <Typography variant={"h2"}>Logging you in...</Typography>
    </div>
  );
}
