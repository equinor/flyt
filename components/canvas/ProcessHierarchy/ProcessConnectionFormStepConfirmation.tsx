import { ProjectCard } from "@/components/Card/ProjectCard";
import { NodeDataCommon } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Project } from "@/types/Project";
import { Typography } from "@equinor/eds-core-react";
import Image from "next/image";
import { Node } from "reactflow";
import processConnectionArrow from "../../../public/process-connection-arrow.svg";
import styles from "./ProcessConnectionForm.module.scss";

type ProcessConnectionFormStepConfirmation = {
  project: Project;
  selectedCard: Project | undefined;
  selectedNode: Node<NodeDataCommon> | undefined;
};

export const ProcessConnectionFormStepConfirmation = ({
  project,
  selectedCard,
  selectedNode,
}: ProcessConnectionFormStepConfirmation) => {
  const getTitle = () => {
    switch (selectedNode?.type) {
      case NodeTypes.input:
        return `"${project?.name}" will be chained after "${selectedCard?.name}"`;
      case NodeTypes.output:
        return `"${selectedCard?.name}" will be chained after "${project?.name}"`;
      default:
        return `"${selectedCard?.name}" will be a subprocess of "${project?.name}"`;
    }
  };

  const getContent = () => {
    switch (selectedNode?.type) {
      case NodeTypes.input:
        return (
          <>
            <div className={styles["confirm-horizontal"]}>
              {selectedCard && <ProjectCard readOnly project={selectedCard} />}
              <Image
                className={styles["confirm-arrow--rotated"]}
                alt="arrow"
                src={processConnectionArrow}
              />
              <ProjectCard readOnly project={project} />
            </div>
          </>
        );
      case NodeTypes.output:
        return (
          <>
            <div className={styles["confirm-horizontal"]}>
              <ProjectCard readOnly project={project} />
              <Image
                className={styles["confirm-arrow--rotated"]}
                alt="arrow"
                src={processConnectionArrow}
              />
              {selectedCard && <ProjectCard readOnly project={selectedCard} />}
            </div>
          </>
        );
      default:
        return (
          <>
            <ProjectCard readOnly project={project} />
            <Image
              className={styles["confirm-arrow"]}
              alt="arrow"
              src={processConnectionArrow}
            />
            {selectedCard && <ProjectCard readOnly project={selectedCard} />}
          </>
        );
    }
  };

  return (
    <>
      <div className={styles["confirm-container"]}>
        <Typography className={styles["confirm-title"]} variant="h1">
          {getTitle()}
        </Typography>
        {getContent()}
      </div>
    </>
  );
};
