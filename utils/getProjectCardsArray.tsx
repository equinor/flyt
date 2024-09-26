import { WashOutFilter } from "@/components/WashOutFilter/WashOutFilter";
import { LoadingVSMCard } from "@/components/Card/LoadingVSMCard";
import { Project } from "@/types/Project";
import { ProjectCard } from "@/components/Card/ProjectCard";

export const placeholderProjectCardsArray = (numberOfCards: number) =>
  Array.from(Array(numberOfCards || 19).keys()).map((e) => (
    <WashOutFilter key={e}>
      <LoadingVSMCard />
    </WashOutFilter>
  ));

export const projectCardsArray = (
  projects: Project[],
  readOnly?: boolean,
  onCardClick?: (vsm: Project) => void,
  selectedCard?: Project
) =>
  projects?.map((vsm: Project) => (
    <ProjectCard
      key={vsm.vsmProjectID}
      vsm={vsm}
      readOnly={readOnly}
      onClick={onCardClick}
      selected={selectedCard?.vsmProjectID === vsm.vsmProjectID}
    />
  ));
