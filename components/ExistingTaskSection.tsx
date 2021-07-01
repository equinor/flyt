import { taskObject } from "../interfaces/taskObject";
import { Checkbox } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import { useStoreDispatch } from "../hooks/storeHooks";
import BaseAPIServices from "../services/BaseAPIServices";
import styles from "./ExistingTaskSection.module.scss";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createAndLinkTask, linkTask, unlinkTask } from "../services/taskApi";
import { vsmObject } from "../interfaces/VsmObject";
import { unknownErrorToString } from "utils/isError";

export function ExistingTaskSection(props: {
  visible: boolean;
  existingTaskFilter;
  selectedObject: vsmObject;
}): JSX.Element {
  if (!props.visible) return <></>;
  const { existingTaskFilter, selectedObject } = props;
  const { tasks } = selectedObject;
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const {
    data: existingTasks,
    error: fetchingTasksError,
    isLoading: fetchingTasks,
  } = useQuery(
    `tasks - ${selectedObject.vsmProjectID}/${existingTaskFilter}`,
    () =>
      BaseAPIServices.get(
        `/api/v1.0/task/list/${selectedObject.vsmProjectID}/${existingTaskFilter}`
      ).then((r) => r.data),
    { enabled: !!existingTaskFilter }
  );
  const taskLinkMutation = useMutation(
    (task: taskObject) => linkTask(selectedObject.vsmObjectID, task.vsmTaskID),
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const taskUnlinkMutation = useMutation(
    (task: taskObject) =>
      unlinkTask(selectedObject.vsmObjectID, task.vsmTaskID),
    {
      onSuccess: () => queryClient.invalidateQueries(),
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  return (
    <div>
      {fetchingTasksError && <p>ERROR: {JSON.stringify(fetchingTasksError)}</p>}
      {fetchingTasks && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 12,
          }}
        >
          <p>Loading...</p>
        </div>
      )}
      {!fetchingTasks && existingTasks.length < 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>{`Couldn't find any for this vsm.`}</p>
          <p>Try adding one.</p>
        </div>
      )}
      <div>
        <ul className={styles.taskList}>
          {existingTasks?.map((t: taskObject) => (
            <li key={t.vsmTaskID}>
              <Checkbox
                defaultChecked={tasks.some(
                  (task) => task?.vsmTaskID === t?.vsmTaskID
                )}
                label={`${t.displayIndex} - ${t.description}`}
                onChange={(event) =>
                  event.target.checked
                    ? taskLinkMutation.mutate(t)
                    : taskUnlinkMutation.mutate(t)
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
