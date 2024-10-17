import { ProjectList } from "@/components/ProjectList";
import { SearchField } from "@/components/SearchField";
import { InfiniteQueryProjects } from "@/types/InfiniteQueryProjects";
import { Project } from "@/types/Project";
import styles from "./ProcessConnectionForm.module.scss";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type ProcessConnectionFormStepProjectListProps = {
  selectedCard?: Project;
  onCardClick: (arg1: Project) => void;
  query: InfiniteQueryProjects;
};

export const ProcessConnectionFormStepProjectList = ({
  selectedCard,
  onCardClick,
  query,
}: ProcessConnectionFormStepProjectListProps) => {
  const { scrollContainerRef } = useInfiniteScroll(query);

  return (
    <>
      <SearchField />
      <div ref={scrollContainerRef} className={styles["projects-container"]}>
        <ProjectList
          query={query}
          readOnly={true}
          onCardClick={(card) => onCardClick(card)}
          selectedCard={selectedCard}
        />
      </div>
    </>
  );
};
