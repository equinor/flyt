import { Task } from "@/types/Task";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { debounce } from "@/utils/debounce";
import { useMutation, useQueryClient } from "react-query";
import { unknownErrorToString } from "@/utils/isError";
import { updateTask } from "@/services/taskApi";
import { notifyOthers } from "@/services/notifyOthers";
import { useAccount, useMsal } from "@azure/msal-react";
import { NodeData } from "../types/NodeData";
import { useProjectId } from "@/hooks/useProjectId";
import dynamic from "next/dynamic";
const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export function EditTaskTextField(props: {
  task: Task;
  canEdit: boolean;
  vsmObject: NodeData;
}) {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { description, id } = props.task;
  const dispatch = useStoreDispatch();

  const { projectId } = useProjectId();
  const queryClient = useQueryClient();
  const updateTaskMutation = useMutation(
    (newObject: Task) => {
      return updateTask(newObject, projectId, id ?? "", props.vsmObject.id);
    },
    {
      onSuccess: () => {
        void notifyOthers("Updated a Q/I/P", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  return (
    <MarkdownEditor
      canEdit={props.canEdit}
      label={"Task description"}
      defaultText={description || ""} //Since we set a default value and not a value, it only updates on init
      onChange={(event) => {
        const updatedTask: Task = {
          ...props.task,
          description: event?.substring(0, 4000) ?? "",
        };
        debounce(
          () => {
            updateTaskMutation.mutate(updatedTask);
          },
          1000,
          "SideBarContent-UpdateTask"
        );
      }}
    />
  );
}
