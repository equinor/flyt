import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Typography } from "@equinor/eds-core-react";
import { Layouts } from "@/layouts/LayoutWrapper";
import { displayErrorResponse, unknownErrorToString } from "@/utils/isError";
import { CanvasWrapper } from "@/components/canvas/Canvas";
import { CircularProgress } from "@equinor/eds-core-react";
import { useProjectId } from "@/hooks/useProjectId";
import { useProjectQuery } from "@/hooks/useProjectQuery";
import { useGraphQuery } from "@/hooks/useGraphQuery";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { deleteProcess } from "@/services/undoRedoApi";
import { useAccount, useMsal } from "@azure/msal-react";
import commonStyles from "../../../styles/common.module.scss";
import styles from "./ProjectPage.module.scss";

export default function Project() {
  const { projectId } = useProjectId();
  const { project, isLoadingProject, projectError } =
    useProjectQuery(projectId);
  const { graph, isLoadingGraph, graphError } = useGraphQuery(projectId);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const delteMutation = useMutation(
    () => {
      return deleteProcess(projectId, account?.username ?? "");
    },
    {
      onSuccess: (response) => {
        console.log("response", response);
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.startsWith("/processes") || url === "/") {
        delteMutation.mutate();
      } else {
        console.log("url", url);
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

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
