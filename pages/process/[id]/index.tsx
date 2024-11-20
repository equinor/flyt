import commonStyles from "../../../styles/common.module.scss";
import styles from "./ProjectPage.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { Layouts } from "@/layouts/LayoutWrapper";
import { displayErrorResponse } from "@/utils/isError";
import { CanvasWrapper } from "@/components/canvas/Canvas";
import { CircularProgress } from "@equinor/eds-core-react";
import { useProjectId } from "@/hooks/useProjectId";
import { useProjectQuery } from "@/hooks/useProjectQuery";
import { useGraphQuery } from "@/hooks/useGraphQuery";

export default function Project() {
  const { projectId } = useProjectId();
  const { project, isLoadingProject, projectError } =
    useProjectQuery(projectId);
  const { graph, isLoadingGraph, graphError } = useGraphQuery(projectId);

  if (projectError || graphError) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {projectId}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">
            {displayErrorResponse(projectError || graphError)}
          </Typography>
          <p>
            We have some troubles with this process. Please try to refresh the
            page.
          </p>
        </main>
      </div>
    );
  }
  if (project && graph) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>{project.name || `Flyt | Process ${projectId}`}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          {isLoadingGraph || isLoadingProject ? (
            <CircularProgress size={48} />
          ) : (
            <CanvasWrapper project={project} graph={graph} />
          )}
        </main>
      </div>
    );
  }
}

Project.layout = Layouts.Canvas;
Project.auth = true;
