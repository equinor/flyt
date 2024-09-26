import { ProjectCard } from "@/components/Card/ProjectCard";
import { ProjectList } from "@/components/ProjectList";
import { SearchField } from "@/components/SearchField";
import { useFormSteps } from "@/hooks/useFormSteps";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Project } from "@/types/Project";
import { Button, Dialog, Icon, Typography } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import Image from "next/image";
import { useState } from "react";
import processConnectionArrow from "../../public/process-connection-arrow.svg";
import styles from "./ProcessConnectionForm.module.scss";
import { getQueryAllProcesses } from "./utils/projectQueries";

type ProcessConnectionFormProps = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

export const ProcessConnectionForm = ({
  project,
  isOpen,
  onClose,
}: ProcessConnectionFormProps) => {
  const query = getQueryAllProcesses(35);
  const { scrollContainerRef } = useInfiniteScroll(query);
  const { step, incStep, decStep } = useFormSteps();
  const [selectedCard, setSelectedCard] = useState<Project | undefined>(
    undefined
  );

  const steps = [
    {
      content: (
        <>
          <SearchField />
          <div
            ref={scrollContainerRef}
            className={styles["projects-container"]}
          >
            <ProjectList
              query={query}
              readOnly={true}
              onCardClick={(card) => setSelectedCard(card)}
              selectedCard={selectedCard}
            />
          </div>
        </>
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selectedCard} onClick={incStep}>
            Next
          </Button>
        </>
      ),
    },
    {
      content: (
        <div className={styles["confirm-container"]}>
          <Typography
            className={styles["confirm-title"]}
            variant="h1"
          >{`"${selectedCard?.name}" will be a subprocess of "${project?.name}"`}</Typography>
          <ProjectCard readOnly vsm={project} />
          <Image
            className={styles["confirm-arrow"]}
            alt="arrow"
            src={processConnectionArrow}
          />
          {selectedCard && <ProjectCard readOnly vsm={selectedCard} />}
        </div>
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={decStep}>
            Back
          </Button>
          <Button>Confirm</Button>
        </>
      ),
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      isDismissable
      className={styles.container}
    >
      <Dialog.Header>
        <Dialog.Title className={styles.title}>Connect Process</Dialog.Title>
        <Button onClick={onClose} variant="ghost_icon">
          <Icon data={close} />
        </Button>
      </Dialog.Header>
      <Dialog.CustomContent className={styles["custom-content-container"]}>
        {steps[step].content}
      </Dialog.CustomContent>
      <Dialog.Actions className={styles["actions-container"]}>
        {steps[step].actions}
      </Dialog.Actions>
    </Dialog>
  );
};
