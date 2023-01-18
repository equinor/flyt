import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { unknownErrorToString } from "../../../utils/isError";
import { CanvasWrapper } from "../../../components/canvas/Canvas";
import { mockApi } from "components/canvas/NodeTypes/MockApi";
import { CircularProgress } from "@equinor/eds-core-react";

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

  if (project) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>{project?.name || `Flyt | Process ${id}`}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <CanvasWrapper project={mockApi} />
        </main>
      </div>
    );
  }

  return <CircularProgress size={48} style={{ margin: "50%" }} />;
}

Project.layout = Layouts.Canvas;
Project.auth = true;
