import React, { useEffect, useState } from "react";
import { AppTopBar, VSMCanvas } from "../components";
import { useLocation } from "react-router";
import { AccountInfo } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react";
import { getData } from "./GetData";
import ReactJson from "react-json-view";
import { isMobile } from "react-device-detect";

export function VSMPage(): JSX.Element {
  const location = useLocation();
  const [project, setProject] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [VSMData, setVSMData] = useState({});

  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    const project = new URLSearchParams(location.search).get("project");
    if (project) setProject(project);
    // Should we set current project here then? Then fetch
  }, [location]);

  useEffect(() => {
    //Only trigger if we have a project
    if (project) {
      setLoading(true);
      getData(
        `/v1.0/project/${project}`,
        account as AccountInfo,
        instance,
        (response: React.SetStateAction<never[]>) => {
          setVSMData(response);
          setLoading(false);
        }
      );
    }
  }, [account, project]);

  console.log(VSMData);
  return (
    <div>
      <AppTopBar style={{ position: "fixed", width: "100%" }} />
      {/*<VSMSideMenu json={VSMData} />*/}
      {!isMobile && (
        <div className={"vsmSideMenu"}>
          <ReactJson src={VSMData} theme={"apathy:inverted"} />
        </div>
      )}
      <VSMCanvas data={VSMData} />
    </div>
  );
}
