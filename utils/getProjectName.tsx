import { Project } from "@/types/Project";

export const getProjectName = (project?: Project | string | null): string => {
  if (!project) return "Untitled process";
  if (typeof project === "string") return project.trim() || "Untitled process";
  return project.name || "Untitled process";
};

export const getFormattedTitle = (project: Project) => {
  const projectName = project.name;
  const match = projectName?.match(/^(.*?)\s*\((.*?)\)$/i);
  if (match) {
    return {
      titleText: match[1],
      duplicateText: match[2],
    };
  }
  return {
    titleText: projectName,
    duplicateText: null,
  };
};
