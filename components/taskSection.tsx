import { taskObject } from "../interfaces/taskObject";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getTasksForProject } from "../services/taskApi";
import { unknownErrorToString } from "../utils/isError";
import { QipCard } from "./QipCard";
import React from "react";

export function TaskSection(props: {
  filterFunction: (t: taskObject) => boolean;
}) {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: errorTasks,
  } = useQuery(["tasks", id], () => getTasksForProject(id));

  return (
    <>
      {isLoadingTasks && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      {!isLoadingTasks && errorTasks && (
        <div>
          <h1>Error loading PQIs for project</h1>
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
          ?.filter(props.filterFunction)
          .sort((a, b) => a.fkTaskType - b.fkTaskType)
          .map((task) => (
            <QipCard
              onClick={() =>
                router.push(`/projects/${id}/qips/${task.vsmTaskID}`)
              }
              key={task.vsmTaskID}
              task={task}
            />
          ))}
      </div>
    </>
  );
}
