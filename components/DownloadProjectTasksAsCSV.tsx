import { taskObject } from "../interfaces/taskObject";
import { vsmProject } from "../interfaces/VsmProject";
import { mergeAndDownload } from "./MergeAndDownload";
import { getDate } from "./GetDate";

export function downloadProjectTasksAsCSV(
  tasks: Array<taskObject>,
  project: vsmProject
): void {
  const csvHeaders = `id,Description\n`;
  const csvFileData = tasks.map((o) => {
    const id = o.displayIndex;
    const description = `"${o.description}"`;

    return [id, description];
  });
  mergeAndDownload(
    csvHeaders,
    csvFileData,
    `Flyt TASKS (${project.vsmProjectID}) - ${project.name} - ${getDate()}.csv`
  );
}
