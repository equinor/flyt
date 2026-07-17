import { Scrim } from "@equinor/eds-core-react";
import type { Graph } from "@/types/Graph";
import { CanvasButtons } from "components/CanvasButtons";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import { Project } from "types/Project";
import { FlowWrapper } from "./Flow";
import { useAccess } from "./hooks/useAccess";
import { useOptionalGuideStage } from "hooks/useOptionalGuide";
import { OptionalGuideProvider } from "./hooks/optionalGuideContext";
import { NodeTypes } from "@/types/NodeTypes";

type CanvasProps = {
  graph: Graph;
  project: Project;
};

const Canvas = ({
  graph: { vertices: apiNodes, edges: apiEdges },
  project,
}: CanvasProps) => {
  const { userCanEdit, userEditCardStatus } = useAccess(project);
  const [guideStarted, setGuideStarted] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);
  const [autoSelectNodeType, setAutoSelectNodeType] = useState<
    NodeTypes | undefined
  >();

  const handleGuideCompleted = () => {
    setGuideStarted(false);
  };
  const {
    currentStage,
    moveToNextStage,
    moveToPreviousStage,
    skipCurrentGuide,
    openStageFromNodeType,
  } = useOptionalGuideStage(
    project.vsmProjectID.toString(),
    handleGuideCompleted
  );
  useEffect(() => {
    const handler = () => {
      setGuideStarted(true);

      openStageFromNodeType(NodeTypes.output);

      setAutoSelectNodeType(NodeTypes.output);
    };

    window.addEventListener("flyt-start-optional-guide", handler);

    return () => {
      window.removeEventListener("flyt-start-optional-guide", handler);
    };
  }, []);
  useEffect(() => {
    if (!guideStarted || !currentStage) {
      return;
    }

    switch (currentStage.stage) {
      case "output":
        setAutoSelectNodeType(NodeTypes.output);
        break;

      case "customer":
        setAutoSelectNodeType(NodeTypes.customer);
        break;

      case "input":
        setAutoSelectNodeType(NodeTypes.input);
        break;

      case "supplier":
        setAutoSelectNodeType(NodeTypes.supplier);
        break;

      case "main activity":
        setAutoSelectNodeType(NodeTypes.mainActivity);
        break;
    }
  }, [currentStage]);

  return (
    <>
      <OptionalGuideProvider
        value={{
          currentStage,
          moveToNextStage,
          moveToPreviousStage,
          skipCurrentGuide,
          openStageFromNodeType,
        }}
      >
        {!(guideStarted && currentStage) && (
          <CanvasButtons
            userCanEdit={userCanEdit}
            handleClickLabel={() => setVisibleLabelScrim(true)}
          />
        )}
        <Scrim
          open={visibleLabelScrim}
          onClose={() => setVisibleLabelScrim(false)}
          isDismissable
        >
          <ManageLabelBox
            handleClose={() => setVisibleLabelScrim(false)}
            isVisible={visibleLabelScrim}
            process={project}
          />
        </Scrim>
        {/* Note: Current and To Be Toggle button is hidden as To Be function is not fully developed. */}
        {/* <ToBeToggle />
      <ResetProcessButton /> */}

        <FlowWrapper
          apiNodes={apiNodes}
          apiEdges={apiEdges}
          userCanEdit={userCanEdit}
          userEditCardStatus={userEditCardStatus}
          autoSelectNodeType={autoSelectNodeType}
          onAutoSelectHandled={() => setAutoSelectNodeType(undefined)}
          isOptionalGuideActive={guideStarted && !!currentStage}
          currentGuideStage={currentStage?.stage}
        />
      </OptionalGuideProvider>
    </>
  );
};

export function CanvasWrapper(props: CanvasProps) {
  return <Canvas {...props} />;
}
