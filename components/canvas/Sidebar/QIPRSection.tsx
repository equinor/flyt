import { Task } from "@/types/Task";
import { Accordion, Button, Icon, Typography } from "@equinor/eds-core-react";
import { PQIRListELement } from "./PQIRListElement";
import styles from "./QIPRSection.module.scss";
import { add } from "@equinor/eds-icons";
import { NewPQIR } from "./NewPQIR";
import { Node } from "reactflow";
import { NodeDataCommon } from "@/types/NodeData";

type QIPRSectionProps = {
  title: string;
  pqirs?: Task[];
  isSelectedSection?: boolean;
  selectedNode: NodeDataCommon;
};

export const QIPRSection = ({
  title,
  pqirs,
  isSelectedSection,
  selectedNode,
}: QIPRSectionProps) => {
  const pqirList = () =>
    pqirs?.map((pqir, index) => (
      <PQIRListELement
        key={index}
        pqir={pqir}
        isSelectedSection={isSelectedSection}
        selectedNode={selectedNode}
      />
    ));

  return (
    <div className={styles.container} style={{ position: "sticky" }}>
      <Typography>{title}</Typography>
      <Accordion className={styles["pqirList"]}>
        {isSelectedSection && <NewPQIR selectedNode={selectedNode} />}
        {pqirList()}
      </Accordion>
    </div>
  );
};
