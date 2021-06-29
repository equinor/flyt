import React, { useEffect, useState } from "react";
import commonStyles from "../styles/common.module.scss";
import Head from "next/head";
import { Button, Icon, Tabs, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../layouts/LayoutWrapper";
import { account_circle, add } from "@equinor/eds-icons";
import BaseAPIServices from "../services/BaseAPIServices";
import { useRouter } from "next/router";
import styles from "./projects/Projects.module.scss";
import { projectTemplatesV1 } from "../assets/projectTemplatesV1";
import { useAccount, useMsal } from "@azure/msal-react";
import { ProjectListSection } from "../components/projectListSection";

const { List, Tab, Panels, Panel } = Tabs;

Icon.add({ account_circle, add });

// eslint-disable-next-line max-lines-per-function
export default function Projects(): JSX.Element {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setFetching(true);
    BaseAPIServices.get("/api/v1.0/project")
      .then((value) => setProjects(value.data))
      .catch((reason) => {
        setError(reason);
      })
      .finally(() => setFetching(false));
  }, []);

  function createNewVSM() {
    setFetching(true);
    BaseAPIServices.post("/api/v1.0/project", projectTemplatesV1.defaultProject)
      .then((value) => router.push(`/projects/${value.data.vsmProjectID}`))
      .catch((reason) => setError(reason))
      .finally(() => setFetching(false));
  }

  if (error)
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Projects</title>
          <link rel="icon" href={"/favicon.ico"} />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
          <Typography variant={"h3"}>{error.toString()}</Typography>
        </main>
      </div>
    );

  const projectsICanView = projects.filter(
    // Only display other peoples projects that have been given a name
    (p) => {
      return (
        !!p.name && p.created.userIdentity !== account?.username.split("@")[0]
      );
    }
  );
  const projectsICanEdit = projects.filter((p) => {
    return p.created.userIdentity === account?.username.split("@")[0];
  });
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <div className={styles.header}>
          <Typography variant={"h1"}>My Value Stream Maps</Typography>
          <Button variant={"outlined"} onClick={() => createNewVSM()}>
            Create new VSM
            <Icon name="add" title="add" />
          </Button>
        </div>
        <>
          {fetching ? (
            <Typography variant={"h2"}>Fetching projects... </Typography>
          ) : (
            <>
              <Tabs
                activeTab={activeTab}
                onChange={(index) => setActiveTab(index)}
              >
                <List
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Tab>Edit</Tab>
                  <Tab>View</Tab>
                </List>
                <Panels>
                  <Panel>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      These are the VSMs you can edit
                    </p>
                    <ProjectListSection projects={projectsICanEdit} />
                  </Panel>
                  <Panel>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      These are the VSMs you can view.
                    </p>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      Currently you can only edit VSMs that you have created or
                      been given access to.
                    </p>
                    <ProjectListSection projects={projectsICanView} />
                  </Panel>
                </Panels>
              </Tabs>
            </>
          )}
        </>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
