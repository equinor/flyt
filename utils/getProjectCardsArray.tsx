import { WashOutFilter } from "../components/WashOutFilter/WashOutFilter";
import { LoadingVSMCard } from "../components/Card/LoadingVSMCard";
import { vsmProject } from "../types/VsmProject";
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

export function projectCardsArray(projects: vsmProject[]): JSX.Element[] {
  return projects?.map((vsm: vsmProject) => (
    <ProjectCard key={vsm.vsmProjectID} vsm={vsm} />
  ));
}
