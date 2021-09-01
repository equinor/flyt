import { taskObject } from "../interfaces/taskObject";
import { vsmObject } from "../interfaces/VsmObject";
import { useStoreDispatch } from "../hooks/storeHooks";
import React from "react";
import styles from "./VSMCanvas.module.scss";
import { Button, Icon } from "@equinor/eds-core-react";
import { EditTaskTextField } from "./EditTaskTextField";
import { delete_to_trash } from "@equinor/eds-icons";
import { useMutation, useQueryClient } from "react-query";
import { unlinkTask } from "../services/taskApi";
import { notifyOthers } from "../services/notifyOthers";
import { unknownErrorToString } from "../utils/isError";
import { useAccount, useMsal } from "@azure/msal-react";
import { useRouter } from "next/router";

export function EditTaskSection(props: {
  task: taskObject;
  object: vsmObject;
  canEdit: boolean;
}): JSX.Element {
  const { task, object } = props;
  const dispatch = useStoreDispatch();

  const router = useRouter();
  const { id } = router.query;
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const queryClient = useQueryClient();
  const taskUnlinkMutation = useMutation(
    (task: taskObject) => unlinkTask(object.vsmObjectID, task.vsmTaskID),
    {
      onSuccess() {
        notifyOthers("Removed Q/I/P from a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  return (
    <div className={styles.headerContainer}>
      {/*  Important to have a key so that it triggers a re-render when needed */}
      <EditTaskTextField
        disabled={!props.canEdit}
        key={task.vsmTaskID}
        task={task}
      />
      <div>
        {/*Must have the button inside a div for flex size to work correctly...*/}
        <Button
          style={{ margin: 8 }}
          title={`Delete selected QIP`}
          disabled={!task || !props.canEdit}
          variant={"ghost_icon"}
          color={"danger"}
          onClick={() => {
            taskUnlinkMutation.mutate(task);
          }}
        >
          <Icon data={delete_to_trash} size={24} />
        </Button>
      </div>
    </div>
  );
}
