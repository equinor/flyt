import { userAccessRole } from "../interfaces/UserAccess";
import { vsmProject } from "../interfaces/VsmProject";
import { getUserShortName } from "./getUserShortName";

/**
 * Get my access in a project
 * @param project
 * @param account
 */
export function getMyAccess(
  project: vsmProject,
  account: { username: string }
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
