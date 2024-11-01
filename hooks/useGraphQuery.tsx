import { getGraph } from "@/services/graphApi";
import { useQuery } from "react-query";

export const useGraphQuery = (projectId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["graph", projectId],
    queryFn: () => getGraph(projectId),
    enabled: !!projectId,
  });
  return { graph: data, isLoadingGraph: isLoading, graphError: error };
};
