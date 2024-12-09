import { getTasksForProject } from "@/services/taskApi";
import { useQuery } from "react-query";
import { useProjectId } from "../../../hooks/useProjectId";
import { TaskTypes } from "@/types/TaskTypes";

export const usePQIRs = (PQIRsFilter?: TaskTypes) => {
  const { projectId } = useProjectId();
  const {
    data: pqirs,
    isLoading: isLoadingPQIRs,
    error: errorPQIRs,
  } = useQuery(`tasks - ${projectId}/${PQIRsFilter}`, () =>
    getTasksForProject(projectId).then((r) => r)
  );

  return { pqirs, isLoadingPQIRs, errorPQIRs };
};
