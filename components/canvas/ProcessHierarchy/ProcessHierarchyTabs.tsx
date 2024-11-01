import { Graph } from "@/types/Graph";
import { NodeDataApi } from "@/types/NodeDataApi";
import { Project } from "@/types/Project";
import { Button, Icon, Tabs, Typography } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { ReactNode, useMemo } from "react";
import { getChainedNodes, getHierarchyNodes } from "../utils/getProcessesNodes";
import { ProcessConnectionFormWrapper } from "./ProcessConnectionForm";
import styles from "./ProcessHierarchyTabs.module.scss";
import { ProcessesFlowWrapper } from "./ProcessesFlow";
import { useProcessHierarchyTabs } from "./useProcessHierarchyTabs";
import { useAccess } from "../hooks/useAccess";

type ProcessHierarchyTabsProps = {
  graph: Graph;
  project: Project;
};

export const ProcessHierarchyTabs = ({
  graph: { vertices: apiNodes, edges: apiEdges },
  project,
}: ProcessHierarchyTabsProps) => {
  const {
    showNewConnectionForm,
    onConnectProcessClick,
    onConnectProcessClose,
    activeTab,
    handleChangeTab,
  } = useProcessHierarchyTabs();
  const { userCanEdit } = useAccess(project);

  const { hierarchyNodes, chainedNodes } = useMemo(() => {
    const hierarchyNodes = getHierarchyNodes(apiNodes, project);
    const chainedNodes = getChainedNodes(apiNodes, project);
    return { hierarchyNodes, chainedNodes };
  }, [apiNodes, project]);

  const getFlowPanel = (nodes: NodeDataApi[], flow: ReactNode) =>
    nodes.length === 1 ? (
      <Typography
        variant="h1"
        className={styles.emptyFlowText}
        style={{ textAlign: "center" }}
      >
        This process has no connected processes. <br />
        {userCanEdit
          ? "Click the <i>Connect Process</i> button above to start connecting processes."
          : "You do not have permission to connect other processes to this process."}
      </Typography>
    ) : (
      flow
    );

  return (
    <Tabs
      activeTab={activeTab}
      onChange={handleChangeTab}
      className={styles.container}
    >
      <Tabs.List className={styles.tabs}>
        <Tabs.Tab>Process Hierarchy</Tabs.Tab>
        <Tabs.Tab>Chained Processes</Tabs.Tab>
        <Tabs.Tab
          disabled={!userCanEdit}
          style={{ border: "none", background: "none" }}
        >
          <Button disabled={!userCanEdit} onClick={onConnectProcessClick}>
            <Icon data={add} />
            Connect Process
          </Button>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels conditionalRender={true} className={styles.panels}>
        <Tabs.Panel className={styles.panel}>
          {getFlowPanel(
            hierarchyNodes,
            <ProcessesFlowWrapper apiNodes={hierarchyNodes} />
          )}
        </Tabs.Panel>
        <Tabs.Panel className={styles.panel}>
          {getFlowPanel(
            chainedNodes,
            <ProcessesFlowWrapper
              apiNodes={chainedNodes}
              isHorizontalFlow={true}
            />
          )}
        </Tabs.Panel>
      </Tabs.Panels>
      {showNewConnectionForm && (
        <ProcessConnectionFormWrapper
          apiNodes={apiNodes}
          apiEdges={apiEdges}
          project={project}
          onClose={onConnectProcessClose}
        />
      )}
    </Tabs>
  );
};
