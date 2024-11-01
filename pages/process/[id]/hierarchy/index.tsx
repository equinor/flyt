import { ButtonNavigateToProcess } from "@/components/ButtonNavigateToProcess";
import { ProcessHierarchyTabs } from "@/components/canvas/ProcessHierarchy/ProcessHierarchyTabs";
import { useProjectId } from "@/hooks/useProjectId";
import { Layouts } from "@/layouts/LayoutWrapper";
import { CircularProgress } from "@equinor/eds-core-react";
import Head from "next/head";
import styles from "./hierarchy.module.scss";
import { useProjectQuery } from "@/hooks/useProjectQuery";
import { useGraphQuery } from "@/hooks/useGraphQuery";

export default function HierarchyPage() {
  const { projectId } = useProjectId();
  const { project, isLoadingProject } = useProjectQuery(projectId);
  const { graph, isLoadingGraph } = useGraphQuery(projectId);

  return (
    <>
      <Head>
        <title>{project?.name} - Hierarchy</title>
      </Head>
      <div className={styles["button-back"]}>
        <ButtonNavigateToProcess />
      </div>
      <div className={styles["hierarchy-container"]}>
        {isLoadingGraph || isLoadingProject ? (
          <CircularProgress size={48} />
        ) : (
          graph &&
          project && <ProcessHierarchyTabs graph={graph} project={project} />
        )}
      </div>
    </>
  );
}

HierarchyPage.layout = Layouts.Canvas;
HierarchyPage.auth = true;
