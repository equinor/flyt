import { Process } from "interfaces/generated";
import { getUserShortName } from "./getUserShortName";

/**
 * Get my access in a project
 * @param project
 * @param account
 */
export function getMyAccess(
  project: Process,
  account: { username: string }
): "Admin" | "Contributor" | "Reader" {
  //Default to "Reader"
  if (!project || !account) return "Reader";

  //If we are the creator of the project, return Admin
  const shortName = getUserShortName(account);
  if (project?.created?.userIdentity?.toUpperCase() === shortName)
    return "Admin";

  //Else, check if we have been given a role, then return that role
  const found = project?.userAccesses.find(
    (u) => u.user.toUpperCase() === shortName
  );
  if (found) return found.role;

  //If not given a role, we default to "Reader"
  return "Reader";
}
