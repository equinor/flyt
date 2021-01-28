import React, { useEffect, useState } from "react";
import moment from "moment";
import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { AppTopBar } from "../components";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { Button, Icon } from "@equinor/eds-core-react";
import { Link, useHistory } from "react-router-dom";
import { VSMCard } from "../components/VSMCard";
import { apiScopes } from "../config/authConfig";
import { fetchData } from "../utils/fetchData";
import { postData } from "../utils/postData";
import { vsmObjectTypes } from "./VsmObjectTypes";
import { simpleProcess } from "../utils/processSamples";
import { UserAuth } from "./UserPage";
import { useLocation } from "react-router";
import { useCookies } from "react-cookie";

interface VSMInterface {
  vsmProjectID: number;
  name: string;
  created: string;
  updated: string;
}

function hideWhenNotLoading(loading: boolean | undefined) {
  if (loading) return "";
  return "hidden";
}

function LoadingIndicator(props: { isLoading: boolean }) {
  const { isLoading } = props;
  return (
    <span className={`${hideWhenNotLoading(isLoading)} loading noselect`}>
      Loading...
    </span>
  );
}

export function OverviewPage(): JSX.Element {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [VSMData, setVSMData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getMyValueStreamMaps(
      "/v1.0/project",
      account as AccountInfo,
      instance,
      (response: React.SetStateAction<never[]>) => {
        setVSMData(response);
        setLoading(false);
      }
    );
  }, [account]);

  function getMyValueStreamMaps(
    url: string,
    useAccount: AccountInfo,
    useInstance: IPublicClientApplication,
    callback: { (response: any): void; (arg0: any): void }
  ): void {
    if (useAccount) {
      useInstance
        .acquireTokenSilent({ ...apiScopes, account: useAccount })
        .then(({ accessToken }) => {
          fetchData(accessToken, url).then((response) => {
            if (callback) {
              callback(response);
            }
          });
        });
    }
  }

  function createNewVSM() {
    setLoading(true);
    if (account) {
      instance
        .acquireTokenSilent({ ...apiScopes, account: account })
        .then(({ accessToken }) => {
          postData(accessToken, `/v1.0/project`, simpleProcess).then(
            (response) => {
              console.log({ response });
              setLoading(false);

              getMyValueStreamMaps(
                "/v1.0/project",
                account as AccountInfo,
                instance,
                (response: React.SetStateAction<never[]>) => {
                  setVSMData(response);
                  setLoading(false);
                }
              );
            }
          );
        });
    }
    setLoading(false);
  }

  return (
    <>
      <AppTopBar />

      <div className={"appear"} style={{ padding: 24 }}>
        <UnauthenticatedTemplate>
          <UserAuth />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <div
            className="noselect"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent:
                window.innerWidth > 550 ? "space-between" : "space-around",
              paddingBottom: 24,
            }}
          >
            <h1>My Value Stream Maps</h1>
            <Button variant={"outlined"} onClick={() => createNewVSM()}>
              Create new VSM
              <Icon name="add" title="add" size={16} />
            </Button>
          </div>
          <>
            <LoadingIndicator isLoading={isLoading} />
            {!isLoading && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: window.innerWidth > 550 ? "unset" : "center",
                }}
              >
                {VSMData.length > 0 ? (
                  VSMData.sort((a: VSMInterface, b: VSMInterface) => {
                    if (moment(a.updated).isBefore(moment(b.updated))) return 1;
                    return -1;
                  }).map((vsm: VSMInterface) => (
                    <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
                  ))
                ) : (
                  <p className={"appear"}>Could not find any VSMs</p>
                )}
              </div>
            )}
          </>
        </AuthenticatedTemplate>
      </div>
    </>
  );
}
