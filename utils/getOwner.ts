import { Project } from "types/Project";

// Get the owner of a project
export function getOwner(vsm: Project) {
  const access = vsm?.userAccesses.find((u) => u.role === "Owner");
  return access ? access.fullName || access.user : null;
}
