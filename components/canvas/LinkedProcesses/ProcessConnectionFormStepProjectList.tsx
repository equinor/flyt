import { ProjectList } from "@/components/ProjectList";
import { SearchField } from "@/components/SearchField";
import { InfiniteQueryProjects } from "@/types/InfiniteQueryProjects";
import { Project } from "@/types/Project";
import styles from "./ProcessConnectionForm.module.scss";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { FilterUserButton } from "@/components/FilterUserButton";
import { FilterLabelButton } from "@/components/Labels/FilterLabelButton";
import { SortSelect } from "@/components/SortSelect";
import { ActiveFilterSection } from "@/components/Labels/ActiveFilterSection";

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
  const { scrollContainerRef } = useInfiniteScroll(query, 128);

  return (
    <>
      <SearchField />
      <div className={styles["sortAndFilter-container"]}>
        <ActiveFilterSection />
        <FilterUserButton />
        <FilterLabelButton />
        <SortSelect />
      </div>
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
