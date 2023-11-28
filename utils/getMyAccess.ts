import { getUserShortName } from "./getUserShortName";
import { Project } from "../types/Project";
import { userAccessRole } from "../types/UserAccess";
import { AccountInfo } from "@azure/msal-browser";

/**
 * Get my access in a project
 * @param project
 * @param account
 */
export function getMyAccess(
  project: Project,
  account: AccountInfo | null
): userAccessRole {
  //If not given a role, we default to "Reader"
  const defaultRole = "Reader";
  if (!project || !account) return defaultRole;

  const shortName = getUserShortName(account);

  // If the user has been given a role, we use that
  const userAccess = project.userAccesses.find(
    (user) => user.user.toUpperCase() === shortName.toUpperCase()
  );
  if (userAccess) return userAccess.role;

  // If the user has not been given a role, we use the default role
  return defaultRole;
}
