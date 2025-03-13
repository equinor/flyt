import { getTasksforSelectedNode } from "@/services/taskApi";
import { useQuery } from "react-query";
import { useProjectId } from "../../../hooks/useProjectId";

export const useSelectedNodePQIR = (vertexId: string) => {
  const { projectId } = useProjectId();
  const {
    data: selectedNodePQIRs,
    isLoading: isLoadingselectedNodePQIRs,
    error: errorselectedNodePQIRs,
  } = useQuery(["selectedNodeTasks", projectId, vertexId], () =>
    getTasksforSelectedNode(projectId, vertexId).then((response) => response)
  );

  return {
    selectedNodePQIRs,
    isLoadingselectedNodePQIRs,
    errorselectedNodePQIRs,
  };
};
