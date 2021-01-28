import React, { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { Button } from "@equinor/eds-core-react";
import { loginRequest } from "../config/authConfig";
import { callMsGraph, ProfileData } from "../utils/graph";
import { AppTopBar } from "../components";

function ProfileContent(): JSX.Element {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    RequestProfileData();
  }, [account]);

  function RequestProfileData() {
    if (account) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: account,
        })
        .then((response) => {
          callMsGraph(response.accessToken).then((response) =>
            setGraphData(response)
          );
        });
    }
  }

  return (
    <>
      <h5 className="card-title">
        Welcome {account ? account.name : "unknown"}
      </h5>
      {graphData ? (
        <ProfileData graphData={graphData} />
      ) : (
        <>
          <Button variant="outlined" onClick={RequestProfileData}>
            Request Profile Information
          </Button>
        </>
      )}
    </>
  );
}

export function UserAuth(): JSX.Element {
  return (
    <>
      <AuthenticatedTemplate>
        <h1>You are logged in</h1>
        <ProfileContent />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h1>You are not logged in</h1>
      </UnauthenticatedTemplate>
      <hr style={{ opacity: 0.1 }} />
      <SignInSignOutButton />
    </>
  );
}

export function SignInSignOutButton(): JSX.Element {
  const { instance } = useMsal();
  return (
    <>
      <AuthenticatedTemplate>
        <Button variant="outlined" onClick={() => instance.logout()}>
          Sign Out
        </Button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button
          variant={"contained"}
          onClick={() => instance.loginRedirect(loginRequest)}
        >
          Sign in
        </Button>
      </UnauthenticatedTemplate>
    </>
  );
}

export function UserPage(): JSX.Element {
  return (
    <>
      <AppTopBar />
      <div className={"appear"} style={{ paddingLeft: 40, paddingRight: 40 }}>
        <UserAuth />
      </div>
    </>
  );
}
