import { NodeDataCommon } from "@/types/NodeData";
import { Task } from "@/types/Task";
import { taskSorter } from "@/utils/taskSorter";
import { Accordion, Typography } from "@equinor/eds-core-react";
import { NewPQIR } from "./NewPQIR";
import { PQIRListELement } from "./PQIRListElement";
import styles from "./PQIRSection.module.scss";

type PQIRSectionProps = {
  title: string;
  pqirs?: Task[];
  emptyPQIRsText: string;
  isSelectedSection?: boolean;
  selectedNode: NodeDataCommon;
  userCanEdit: boolean;
};

export const PQIRSection = ({
  title,
  pqirs,
  emptyPQIRsText,
  isSelectedSection,
  selectedNode,
  userCanEdit,
}: PQIRSectionProps) => {
  const pqirList = () => {
    if (!pqirs?.length) {
      return (
        <Typography style={{ textAlign: "center" }}>
          {emptyPQIRsText}
        </Typography>
      );
    }
    return pqirs
      ?.sort(taskSorter())
      .map((pqir, index) => (
        <PQIRListELement
          key={index}
          pqir={pqir}
          isSelectedSection={isSelectedSection}
          selectedNode={selectedNode}
          userCanEdit={userCanEdit}
        />
      ));
  };

  return (
    <div className={styles.container}>
      <Typography group="input" variant="label" style={{ fontSize: "16px" }}>
        {title}
      </Typography>
      <Accordion className={styles["pqirList"]}>
        {userCanEdit && isSelectedSection && (
          <NewPQIR selectedNode={selectedNode} />
        )}
        {pqirList()}
      </Accordion>
    </div>
  );
};
