import { Task } from "../types/Task";
import { Checkbox } from "@equinor/eds-core-react";
import { useStoreDispatch } from "../hooks/storeHooks";
import styles from "./ExistingTaskSection.module.scss";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTasksForProject, linkTask, unlinkTask } from "../services/taskApi";
import { NodeDataApi } from "../types/NodeDataApi";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { notifyOthers } from "../services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { getTaskShorthand } from "utils/getTaskShorthand";

export function ExistingTaskSection(props: {
  visible: boolean;
  existingTaskFilter;
  selectedNode: NodeDataApi;
}): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const { existingTaskFilter, selectedNode } = props;
  const { tasks } = selectedNode;
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const {
    data: existingTasks,
    error: fetchingTasksError,
    isLoading: fetchingTasks,
  } = useQuery(
    `tasks - ${selectedNode.projectId}/${existingTaskFilter}`,
    () => getTasksForProject(selectedNode.projectId).then((r) => r),
    { enabled: !!existingTaskFilter }
  );
  const router = useRouter();
  const { id } = router.query;
  const taskLinkMutation = useMutation(
    (task: Task) => linkTask(id, selectedNode.id, task.id),
    {
      onSuccess: () => {
        notifyOthers("Added a Q/I/P to a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const taskUnlinkMutation = useMutation(
    (task: Task) => unlinkTask(id, selectedNode.id, task.id),
    {
      onSuccess() {
        notifyOthers("Removed Q/I/P from a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  if (!props.visible) return <></>;

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
          <p>{`Couldn't find any for this process.`}</p>
          <p>Try adding one.</p>
        </div>
      )}
      <div>
        <ul className={styles.taskList}>
          {existingTasks?.map((t: Task) => {
            if (t.type === existingTaskFilter) {
              return (
                <li key={t.id} title={t.description}>
                  <Checkbox
                    defaultChecked={tasks.some((task) => task?.id === t?.id)}
                    label={`${getTaskShorthand(t)} - ${t.description}`}
                    onChange={(event) =>
                      event.target.checked
                        ? taskLinkMutation.mutate(t)
                        : taskUnlinkMutation.mutate(t)
                    }
                  />
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}
