import { vsmProject } from "../interfaces/VsmProject";
import { AccountInfo } from "@azure/msal-browser";
import { getUserShortName } from "./getUserShortName";

export function checkIfCreatorOrEditor(
  project: vsmProject,
  account: AccountInfo
): { imCreator: boolean; imEditor: boolean } {
  const shortName = getUserShortName(account);
  return {
    imCreator: project.created.userIdentity === shortName,
    imEditor: project.userAccesses?.some((a) => a.user === shortName),
  };
}
