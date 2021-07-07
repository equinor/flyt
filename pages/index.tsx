import React, { useState } from "react";
import commonStyles from "../styles/common.module.scss";
import Head from "next/head";
import { Button, Icon, Tabs, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../layouts/LayoutWrapper";
import { account_circle, add } from "@equinor/eds-icons";
import { useRouter } from "next/router";
import styles from "./projects/Projects.module.scss";
import { useAccount, useMsal } from "@azure/msal-react";
import { ProjectListSection } from "../components/projectListSection";
import { useMutation, useQuery } from "react-query";
import { createProject, getProjects } from "../services/projectApi";
import { categorizeProjects } from "../utils/categorizeProjects";

const { List, Tab, Panels, Panel } = Tabs;

// eslint-disable-next-line max-lines-per-function
export default function Projects(): JSX.Element {
  const router = useRouter();

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const [activeTab, setActiveTab] = useState(0);
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery("projects", getProjects);
  const newProjectMutation = useMutation(() =>
    createProject().then((value) =>
      router.push(`/projects/${value.data.vsmProjectID}`)
    )
  );

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

  const { projectsICanEdit, projectsICanView } = categorizeProjects(
    projects,
    account
  );

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <div className={styles.header}>
          <Typography variant={"h1"}>My Value Stream Maps</Typography>
          <Button
            variant={"outlined"}
            onClick={() => newProjectMutation.mutate()}
          >
            Create new VSM
            <Icon data={add} title="add" />
          </Button>
        </div>
        <>
          {isLoading ? (
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
                      You can only edit VSMs that you have created or been given
                      access to.
                    </p>
                    <ProjectListSection
                      projects={projectsICanView.filter((p) => p.name)}
                    />
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
