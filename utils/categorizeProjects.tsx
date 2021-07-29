import { vsmProject } from "../interfaces/VsmProject";
import { AccountInfo } from "@azure/msal-browser";

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
    const imCreator =
      project.created.userIdentity === account?.username.split("@")[0];

    const imEditor = project.userAccesses?.find(
      (a) => a.user === account?.username.split("@")[0]
    );

    if (imCreator || imEditor) {
      projectsICanEdit.push(project);
    } else {
      projectsICanView.push(project);
    }
  });
  return { projectsICanEdit, projectsICanView };
}
