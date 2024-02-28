import { WashOutFilter } from "../components/WashOutFilter/WashOutFilter";
import { LoadingVSMCard } from "../components/Card/LoadingVSMCard";
import { Project } from "../types/Project";
import { ProjectCard } from "../components/Card/ProjectCard";

export function placeholderProjectCardsArray(
  numberOfCards: number
): JSX.Element[] {
  return Array.from(Array(numberOfCards || 19).keys()).map((e) => (
    <WashOutFilter key={e}>
      <LoadingVSMCard />
    </WashOutFilter>
  ));
}

export function projectCardsArray(projects: Project[]): JSX.Element[] {
  return projects?.map((vsm: Project) => (
    <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
  ));
}
