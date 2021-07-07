import { vsmProject } from "../interfaces/VsmProject";
import { flattenProject } from "../utils/flattenProject";
import { getVsmTypeName } from "./GetVsmTypeName";
import { mergeAndDownload } from "./MergeAndDownload";
import { getDate } from "./GetDate";

export function downloadProjectCardsAsCSV(project: vsmProject): void {
  const flatProject = flattenProject(project);

  const csvHeaders = `id,Description,ChoiceGroup,Type,Parent,Children,Tasks\n`;
  const csvFileData = flatProject.map((o) => {
    const id = o.vsmObjectID;
    const description = `"${o.name}"`;
    const type = getVsmTypeName(o.vsmObjectType.pkObjectType);
    const parentObject = o.parent;
    const choiceGroup = o.choiceGroup || "";
    const children = `"${o.childObjects.map((c) => c.vsmObjectID)}"`;
    const tasks = `"${o.tasks.map((t) => t.displayIndex)}"`;

    return [id, description, choiceGroup, type, parentObject, children, tasks];
  });

  mergeAndDownload(
    csvHeaders,
    csvFileData,
    `Flyt CARDS (${project.vsmProjectID}) - ${project.name} - ${getDate()}.csv`
  );
}
