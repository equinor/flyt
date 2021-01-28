import React, { useState } from "react";
import { AppTopBar } from "../components";
import { useAccount, useMsal } from "@azure/msal-react";
import { apiScopes } from "../config/authConfig";
import { postData } from "../utils/postData";
import { Button, TextField } from "@equinor/eds-core-react";
import { simpleProcess } from "../utils/processSamples";

export function NewVSMPage(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [VSMData, setVSMData] = useState({});
  const [processTitle, setProjectName] = useState("");

  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  if (isLoading) {
    return <p className={"appear"}>Loading</p>;
  }

  function createNewVSM() {
    setLoading(true);
    if (account) {
      instance
        .acquireTokenSilent({ ...apiScopes, account: account })
        .then(({ accessToken }) => {
          postData(accessToken, `/v1.0/project`, simpleProcess).then(
            (response) => {
              setVSMData(response);
              setLoading(false);
            }
          );
        });
    }
    setLoading(false);
  }

  return (
    <div>
      <AppTopBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div style={{ paddingRight: 24 }}>
          <TextField
            variant={"default"}
            id={"0"}
            autoFocus={true}
            label={"Process title"}
            value={processTitle}
            onChange={(event: any) => setProjectName(event.target.value)}
          />

          <Button
            variant={"contained"}
            onClick={() => {
              createNewVSM();
            }}
          >
            Create new vsm
          </Button>
        </div>
      </div>
      {/*<div className={"vsmSideMenu"} style={{ marginTop: 64 }}>*/}
      {/*  <ReactJson src={VSMData} theme={"apathy:inverted"} />*/}
      {/*</div>*/}
      {/*<VSMCanvas />*/}
    </div>
  );
}
