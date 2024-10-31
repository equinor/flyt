import { ButtonNavigateToProcess } from "@/components/ButtonNavigateToProcess";
import { ProcessHierarchyTabs } from "@/components/canvas/ProcessHierarchy/ProcessHierarchyTabs";
import { useProjectId } from "@/hooks/useProjectId";
import { Layouts } from "@/layouts/LayoutWrapper";
import { getGraph } from "@/services/graphApi";
import { getProject } from "@/services/projectApi";
import { CircularProgress } from "@equinor/eds-core-react";
import Head from "next/head";
import { useQueries } from "react-query";
import styles from "./hierarchy.module.scss";

export default function HierarchyPage() {
  const { projectId } = useProjectId();

  const [projectQuery, graphQuery] = useQueries([
    {
      queryKey: ["project", projectId],
      queryFn: () => getProject(projectId),
      enabled: !!projectId,
    },
    {
      queryKey: ["graph", projectId],
      queryFn: () => getGraph(projectId),
      enabled: !!projectId,
    },
  ]);

  const project = projectQuery.data;
  const graph = graphQuery.data;

  return (
    <>
      <Head>
        <title>{project?.name} - Hierarchy</title>
      </Head>
      <div className={styles["button-back"]}>
        <ButtonNavigateToProcess />
      </div>
      <div className={styles["hierarchy-container"]}>
        {graphQuery.isLoading || projectQuery.isLoading ? (
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
