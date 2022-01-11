import { Process } from "interfaces/generated";
import { getUserShortName } from "./getUserShortName";
import { vsmProject } from "interfaces/VsmProject";

/**
 * Get my access in a project
 * @param process
 * @param account
 */
export function getMyAccess(
  process: Process | vsmProject, //todo: change to process type
  account: { username: string }
): "Admin" | "Contributor" | "Reader" {
  //Default to "Reader"
  if (!process || !account) return "Reader";

  //If we are the creator of the project, return Admin
  const shortName = getUserShortName(account);
  if (process?.created?.userIdentity?.toUpperCase() === shortName)
    return "Admin";

  //Else, check if we have been given a role, then return that role
  const found = process?.userAccesses.find(
    (u) => u.user.toUpperCase() === shortName
  );
  if (found) return found.role;

  //If not given a role, we default to "Reader"
  return "Reader";
}
