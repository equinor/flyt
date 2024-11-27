import { ProjectCard } from "@/components/Card/ProjectCard";
import { NodeDataCommon } from "@/types/NodeData";
import { NodeTypes } from "@/types/NodeTypes";
import { Project } from "@/types/Project";
import { getProjectName } from "@/utils/getProjectName";
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
  const projectName = getProjectName(project);
  const linkedProjectName = getProjectName(selectedCard);

  const getTitle = () => {
    switch (selectedNode?.type) {
      case NodeTypes.input:
        return `"${projectName}" will be chained after "${linkedProjectName}"`;
      case NodeTypes.output:
        return `"${linkedProjectName}" will be chained after "${projectName}"`;
      default:
        return `"${linkedProjectName}" will be a subprocess of "${projectName}"`;
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
