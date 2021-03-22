import React, { useEffect, useState } from "react";
import commonStyles from "../styles/common.module.scss";
import Head from "next/head";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../layouts/LayoutWrapper";
import { account_circle, add } from "@equinor/eds-icons";
import { VSMCard } from "../components/Card/Card";
import BaseAPIServices from "../services/BaseAPIServices";
import { useRouter } from "next/router";
import { vsmProject } from "../interfaces/VsmProject";
import styles from "./projects/Projects.module.scss";
import { projectTemplatesV1 } from "../assets/projectTemplatesV1";

Icon.add({ account_circle, add });

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

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
          <title>VSM | Projects</title>
          <link rel="icon" href={"/favicon.ico"} />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
          <Typography variant={"h3"}>{error.toString()}</Typography>
        </main>
      </div>
    );

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>VSM | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <div className={styles.header}>
          <h1>My Value Stream Maps</h1>
          <Button
            style={{ marginLeft: 24 }}
            variant={"outlined"}
            onClick={() => createNewVSM()}
          >
            Create new VSM
            <Icon name="add" title="add" size={16} />
          </Button>
        </div>
        <>
          {!!fetching ? (
            <Typography variant={"h2"}>Fetching projects... </Typography>
          ) : (
            <div className={styles.vsmCardContainer}>
              {projects?.length > 0 ? (
                projects.map((vsm: vsmProject) => (
                  <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
                ))
              ) : (
                <p className={commonStyles.appear}>Could not find any VSMs</p>
              )}
            </div>
          )}
        </>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
