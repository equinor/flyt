import { vsmProject } from "../interfaces/VsmProject";
import { AccountInfo } from "@azure/msal-browser";
import { checkIfCreatorOrEditor } from "./checkIfCreatorOrEditor";

/**
 * Sort projects into two buckets.
 * 1. projects the account can Edit
 * 2. projects the account can View
 * @param projects
 * @param account
 */
export function categorizeProjects(
  projects: [vsmProject],
  account: AccountInfo
): {
  projectsICanEdit: Array<vsmProject>;
  projectsICanView: Array<vsmProject>;
} {
  const projectsICanEdit = [];
  const projectsICanView = [];

  projects?.forEach((project) => {
    const { imCreator, imEditor } = checkIfCreatorOrEditor(project, account);

    if (imCreator || imEditor) {
      projectsICanEdit.push(project);
    } else {
      projectsICanView.push(project);
    }
  });
  return { projectsICanEdit, projectsICanView };
}
