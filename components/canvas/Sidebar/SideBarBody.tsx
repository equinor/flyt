import { usePQIRs } from "@/components/canvas/hooks/usePQIRs";
import { NodeDataCommon } from "../../../types/NodeData";
import { PQIRSection } from "./PQIRSection";
import styles from "./SidebarBody.module.scss";
import { CircularProgress, Typography } from "@equinor/eds-core-react";
import { unknownErrorToString } from "@/utils/isError";

type SideBarBodyProps = {
  selectedNode: NodeDataCommon;
  userCanEdit: boolean;
};

export const SideBarBody = ({
  selectedNode,
  userCanEdit,
}: SideBarBodyProps) => {
  const { pqirs, isLoadingPQIRs, errorPQIRs } = usePQIRs();

  const otherPQIRs = pqirs?.filter((pqir) =>
    selectedNode.tasks.every(
      (selectedNodePQIR) => selectedNodePQIR.id !== pqir.id
    )
  );

  if (isLoadingPQIRs) {
    return <CircularProgress style={{ alignSelf: "center" }} />;
  }
  if (errorPQIRs) {
    return <Typography>{unknownErrorToString(errorPQIRs)}</Typography>;
  }
  return (
    <div className={styles.container}>
      <PQIRSection
        title="Selected card's PQIRs"
        emptyPQIRsText="This card has no PQIRs"
        pqirs={selectedNode.tasks}
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
