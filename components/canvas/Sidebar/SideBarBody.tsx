import { usePQIRs } from "@/components/canvas/hooks/usePQIRs";
import { NodeDataCommon } from "../../../types/NodeData";
import { QIPRSection } from "./QIPRSection";

type SideBarBodyProps = {
  selectedNode: NodeDataCommon;
};

export const SideBarBody = ({ selectedNode }: SideBarBodyProps) => {
  const { pqirs, isLoadingPQIRs, errorPQIRs } = usePQIRs();

  const otherPQIRs = pqirs?.filter((pqir) =>
    selectedNode.tasks.every(
      (selectedNodePQIR) => selectedNodePQIR.id !== pqir.id
    )
  );

  return (
    <>
      <QIPRSection
        title="Selected PQIR's"
        pqirs={selectedNode.tasks}
        isSelectedSection
        selectedNode={selectedNode}
      />
      <QIPRSection
        title="Other PQIR's in this process"
        pqirs={otherPQIRs}
        selectedNode={selectedNode}
      />
    </>
  );
};
