import { QipCard } from "./QipCard";
import React from "react";
import { getTasksForProject } from "../services/taskApi";
import { taskObject } from "../interfaces/taskObject";
import { unknownErrorToString } from "../utils/isError";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { vsmTaskTypes } from "types/vsmTaskTypes";

export function TaskSection(props: {
  filterFunction: (t: taskObject) => boolean;
}): JSX.Element {
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
          .sort((a, b) => {
            return vsmTaskTypes[b.type] - vsmTaskTypes[a.type];
          })
          .map((task) => (
            <QipCard key={task.id} task={task} />
          ))}
      </div>
    </>
  );
}
