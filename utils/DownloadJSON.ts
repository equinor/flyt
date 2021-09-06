import { vsmProject } from "../interfaces/VsmProject";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import { stripGarbage } from "./StripGarbage";

export function getProjectAsCleanJsonWithoutQIPs(
  project: vsmProject,
  projectName?: string,
  duplicateOf?: string
) {
  return {
    name: projectName || project.name,
    duplicateOf,
    objects: [
      {
        parent: 0,
        name: projectName || project.name,
        fkObjectType: vsmObjectTypes.process,
        childObjects: project.objects[0].childObjects.map((o) =>
          stripGarbage(o)
        ),
      },
    ],
  } as vsmProject;
}

export function downloadJSON(project: vsmProject): void {
  const formattedProject = getProjectAsCleanJsonWithoutQIPs(project);

  const json = JSON.stringify(formattedProject);
  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/json;charset=utf-8," + encodeURI(json);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  hiddenElement.download = `Flyt ${project.vsmProjectID} CARDS - ${project.name} - ${date}.json`;

  hiddenElement.click();
}
