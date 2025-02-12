import { Graph } from "@/types/Graph";
import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { useState } from "react";
import "reactflow/dist/style.css";
import { Project } from "types/Project";
import { LiveIndicator } from "../LiveIndicator";
import { FlowWrapper } from "./Flow";
import { useAccess } from "./hooks/useAccess";
import { useWebSocket } from "./hooks/useWebSocket";

type CanvasProps = {
  graph: Graph;
  project: Project;
};

const Canvas = ({
  graph: { vertices: apiNodes, edges: apiEdges },
  project,
}: CanvasProps) => {
  const { userCanEdit } = useAccess(project);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const { socketConnected, socketReason } = useWebSocket();

  return (
    <>
      <CanvasButtons
        userCanEdit={userCanEdit}
        handleClickLabel={() => setVisibleLabelScrim(true)}
      />
      <ManageLabelBox
        handleClose={() => setVisibleLabelScrim(false)}
        isVisible={visibleLabelScrim}
        process={project}
      />
      <LiveIndicator
        live={socketConnected}
        title={
          socketConnected
            ? "Connection is looking good!\nYour changes should appear immediately for other users."
            : `You are not connected${
                socketReason ? " because of ${socketReason}" : ""
              }.`
        }
      />
      {/* Note: Current and To Be Toggle button is hidden as To Be function is not fully developed. */}
      {/* <ToBeToggle />
      <ResetProcessButton /> */}
      <FlowWrapper
        apiNodes={apiNodes}
        apiEdges={apiEdges}
        userCanEdit={userCanEdit}
      />
    </>
  );
};

export function CanvasWrapper(props: CanvasProps) {
  return <Canvas {...props} />;
}
