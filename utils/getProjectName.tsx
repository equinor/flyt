import { Project } from "@/types/Project";

export const getProjectName = (project?: Project) =>
  project?.name || "Untitled process";
