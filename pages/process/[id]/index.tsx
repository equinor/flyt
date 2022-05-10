import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { unknownErrorToString } from "../../../utils/isError";
import { Loading } from "../../../components/loading";
import { ErrorMessage } from "../../../components/errorMessage";
import { vsmObject } from "../../../interfaces/VsmObject";
import { DraggableMainActivity } from "../../../components/card";

function Process(props: { processId: string | string[] }) {
  const { processId: id } = props;
  const {
    data: process,
    error,
    isLoading,
  } = useQuery(["project", id], () => getProject(id), {
    enabled: !!id,
  });
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!process) {
    return <ErrorMessage error={"No process found"} />;
  }

  return (
    <div>
      <Head>
        <title>{process.name}</title>
      </Head>
      <div
        style={{
          // backgroundColor: "blueviolet",
          paddingTop: 64,
          display: "flex",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: "5px",
        }}
      >
        {process.objects[0].childObjects.map((child) => (
          <DraggableMainActivity key={child.vsmObjectID} child={child} />
        ))}
      </div>
    </div>
  );
}

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const { data: project, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );

  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">{unknownErrorToString(error)}</Typography>
          <p>
            We have some troubles with this process. Please try to refresh the
            page.
          </p>
        </main>
      </div>
    );
  }
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{project?.name || `Flyt | Process ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Process processId={id} />
      </main>
    </div>
  );
}

Project.layout = Layouts.Canvas;
Project.auth = true;
