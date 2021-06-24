import { vsmProject } from "../interfaces/VsmProject";

/**
 * Get my access in a project
 * @param project
 * @param account
 */
export function getMyAccess(
  project: vsmProject,
  account: { username: string }
): "Admin" | "Contributor" | "Reader" {
  //Default to "Reader"
  if (!project || !account) return "Reader";

  //If we are the creator of the project, return Admin
  const shortName = account.username.split("@")[0];
  if (project.created.userIdentity === shortName) return "Admin";

  //Else, check if we have been given a role, then return that role
  const found = project.userAccesses.find((u) => u.user === shortName);
  if (found) return found.role;

  //If not given a role, we default to "Reader"
  return "Reader";
}
