import { ButtonNavigateToProcess } from "@/components/ButtonNavigateToProcess";
import { LinkedProcessesTabs } from "@/components/canvas/LinkedProcesses/LinkedProcessesTabs";
import { useProjectId } from "@/hooks/useProjectId";
import { Layouts } from "@/layouts/LayoutWrapper";
import { CircularProgress } from "@equinor/eds-core-react";
import Head from "next/head";
import styles from "./linkedProcesses.module.scss";
import { useProjectQuery } from "@/hooks/useProjectQuery";
import { useGraphQuery } from "@/hooks/useGraphQuery";

export default function LinkedProcessesPage() {
  const { projectId } = useProjectId();
  const { project, isLoadingProject } = useProjectQuery(projectId);
  const { graph, isLoadingGraph } = useGraphQuery(projectId);

  return (
    <>
      <Head>
        <title>{project?.name} - Linked Processes</title>
      </Head>
      <div className={styles["button-back"]}>
        <ButtonNavigateToProcess />
      </div>
      <div className={styles["linkedProcesses-container"]}>
        {isLoadingGraph || isLoadingProject ? (
          <CircularProgress size={48} />
        ) : (
          graph &&
          project && <LinkedProcessesTabs graph={graph} project={project} />
        )}
      </div>
    </>
  );
}

LinkedProcessesPage.layout = Layouts.Canvas;
LinkedProcessesPage.auth = true;
