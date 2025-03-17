import { usePQIRs } from "@/components/canvas/hooks/usePQIRs";
import { NodeDataCommon } from "../../../types/NodeData";
import { PQIRSection } from "./PQIRSection";
import styles from "./SidebarBody.module.scss";
import { CircularProgress, Typography } from "@equinor/eds-core-react";
import { unknownErrorToString } from "@/utils/isError";
import { Task } from "@/types/Task";
import { useSelectedNodePQIR } from "../hooks/useSelectedNodePQIR";

type SideBarBodyProps = {
  selectedNode: NodeDataCommon;
  userCanEdit: boolean;
};

export const SideBarBody = ({
  selectedNode,
  userCanEdit,
}: SideBarBodyProps) => {
  const { pqirs, isLoadingPQIRs, errorPQIRs } = usePQIRs();
  const {
    selectedNodePQIRs,
    isLoadingselectedNodePQIRs,
    errorselectedNodePQIRs,
  } = useSelectedNodePQIR(selectedNode.id);
  const otherPQIRs = pqirs?.filter(
    (pqir) =>
      selectedNodePQIRs &&
      selectedNodePQIRs.every(
        (selectedNodePQIR: Task) => selectedNodePQIR.id !== pqir.id
      )
  );

  if (isLoadingPQIRs || isLoadingselectedNodePQIRs) {
    return <CircularProgress style={{ alignSelf: "center" }} />;
  }
  if (errorPQIRs || errorselectedNodePQIRs) {
    const errors = errorPQIRs ? errorPQIRs : errorselectedNodePQIRs;
    return <Typography>{unknownErrorToString(errors)}</Typography>;
  }
  return (
    <div className={styles.container}>
      <PQIRSection
        title="Selected card's PQIRs"
        emptyPQIRsText="This card has no PQIRs"
        pqirs={selectedNodePQIRs}
        isSelectedSection
        selectedNode={selectedNode}
        userCanEdit={userCanEdit}
      />
      <PQIRSection
        title="Other PQIR's in this process"
        emptyPQIRsText="This process has no other PQIRs"
        pqirs={otherPQIRs}
        selectedNode={selectedNode}
        userCanEdit={userCanEdit}
      />
    </div>
  );
};
