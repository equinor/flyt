import { QipCard } from "./QipCard";
import { getTasksForProject } from "../services/taskApi";
import { Task } from "../types/Task";
import { unknownErrorToString } from "../utils/isError";
import { useQuery } from "react-query";
import { taskSorter } from "@/utils/taskSorter";
import { useProjectId } from "@/hooks/useProjectId";

export function TaskSection(props: {
  filterFunction: (t: Task) => boolean;
}): JSX.Element {
  const { projectId } = useProjectId();

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: errorTasks,
  } = useQuery(["tasks", projectId], () => getTasksForProject(projectId));

  return (
    <>
      {isLoadingTasks && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      {!isLoadingTasks && errorTasks && (
        <div>
          <h1>Error loading PQIRs for project</h1>
          <p>{unknownErrorToString(errorTasks)}</p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: 24,
        }}
      >
        {tasks
          ?.filter((task) => !task.solved) // filter out solved tasks
          ?.filter(props.filterFunction)
          .sort(taskSorter())
          .map((task) => (
            <QipCard key={task.id} task={task} />
          ))}
      </div>
    </>
  );
}
