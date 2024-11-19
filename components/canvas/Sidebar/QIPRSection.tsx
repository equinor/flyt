import { Task } from "@/types/Task";
import { Accordion, Typography } from "@equinor/eds-core-react";
import { PQIRListELement } from "./PQIRListElement";
import styles from "./QIPRSection.module.scss";
import { NewPQIR } from "./NewPQIR";
import { NodeDataCommon } from "@/types/NodeData";
import { taskSorter } from "@/utils/taskSorter";

type QIPRSectionProps = {
  title: string;
  pqirs?: Task[];
  emptyPQIRsText: string;
  isSelectedSection?: boolean;
  selectedNode: NodeDataCommon;
  userCanEdit: boolean;
};

export const QIPRSection = ({
  title,
  pqirs,
  emptyPQIRsText,
  isSelectedSection,
  selectedNode,
  userCanEdit,
}: QIPRSectionProps) => {
  const pqirList = pqirs
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

  return (
    <div className={styles.container}>
      <Typography group="input" variant="label" style={{ fontSize: "16px" }}>
        {title}
      </Typography>
      <Accordion className={styles["pqirList"]}>
        {userCanEdit && isSelectedSection && (
          <NewPQIR selectedNode={selectedNode} />
        )}
        {pqirList?.length ? (
          pqirList
        ) : (
          <Typography style={{ textAlign: "center" }}>
            {emptyPQIRsText}
          </Typography>
        )}
      </Accordion>
    </div>
  );
};
