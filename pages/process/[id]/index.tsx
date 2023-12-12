import commonStyles from "../../../styles/common.module.scss";
import styles from "./ProjectPage.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { getGraph } from "services/graphApi";
import { unknownErrorToString } from "../../../utils/isError";
import { CanvasWrapper } from "../../../components/canvas/Canvas";
import { CircularProgress } from "@equinor/eds-core-react";

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const {
    isLoading: isLoadingProject,
    data: project,
    error: errorProject,
  } = useQuery(
    ["project", id],
    () => {
      return getProject(id);
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingGraph,
    data: graph,
    error: errorGraph,
  } = useQuery(["graph", id], () => getGraph(id));

  if (errorProject || errorGraph) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">
            {unknownErrorToString(errorProject || errorGraph)}
          </Typography>
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

Project.layout = Layouts.Canvas;
Project.auth = true;
