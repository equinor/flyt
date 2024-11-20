import { getProject } from "@/services/projectApi";
import { useQuery } from "react-query";

export const useProjectQuery = (projectId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  });
  return { project: data, isLoadingProject: isLoading, projectError: error };
};
