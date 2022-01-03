import { vsmProject } from "interfaces/VsmProject";

// Get the owner of a project
export function getOwner(vsm: vsmProject) {
  const access = vsm?.userAccesses.find((u) => u.role === "Owner");
  return access ? access.user : null;
}
