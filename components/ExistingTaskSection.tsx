import { taskObject } from "../interfaces/taskObject";
import { Checkbox } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import { useStoreDispatch } from "../hooks/storeHooks";
import BaseAPIServices from "../services/BaseAPIServices";
import styles from "./ExistingTaskSection.module.scss";

export function ExistingTaskSection(props: {
  visible: boolean;
  existingTaskFilter;
  selectedObject;
}): JSX.Element {
  if (!props.visible) return <></>;
  const { existingTaskFilter, selectedObject } = props;
  const { tasks } = selectedObject;
  const dispatch = useStoreDispatch();
  const [fetchingTasks, setFetchingTasks] = useState(false);
  const [fetchingTasksError, setFetchingTasksError] = useState(false);
  const [existingTasks, setExistingTasks] = useState([]);

  useEffect(() => {
    if (existingTaskFilter) {
      setFetchingTasks(true);
      setFetchingTasksError(null);
      setExistingTasks([]);
      BaseAPIServices.get(
        `/api/v1.0/task/list/${selectedObject.vsmProjectID}/${existingTaskFilter}`
      )
        .then((value) => setExistingTasks(value.data))
        .catch((reason) => {
          setFetchingTasksError(reason);
        })
        .finally(() => setFetchingTasks(false));
    }
  }, [existingTaskFilter]);

  function linkTask(t: taskObject) {
    dispatch.linkTask({
      taskId: t.vsmTaskID,
      projectId: selectedObject.vsmProjectID,
      vsmObjectId: selectedObject.vsmObjectID,
      task: t,
    });
  }

  function unLinkTask(t: taskObject) {
    dispatch.unlinkTask({ object: selectedObject, task: t });
  }

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
          {existingTasks.map((t: taskObject) => (
            <li key={t.vsmTaskID}>
              <Checkbox
                defaultChecked={tasks.some(
                  (task) => task?.vsmTaskID === t?.vsmTaskID
                )}
                label={`${t.vsmTaskID} - ${t.description}`}
                onChange={(event) =>
                  event.target.checked ? linkTask(t) : unLinkTask(t)
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
