import { taskObject } from "../interfaces/taskObject";
import { useStoreDispatch } from "../hooks/storeHooks";
import React from "react";
import { TextField } from "@equinor/eds-core-react";
import { debounce } from "../utils/debounce";

export function EditTaskTextField(props: {
  task: taskObject;
  disabled: boolean;
}): JSX.Element {
  const { description, vsmTaskID } = props.task;
  const dispatch = useStoreDispatch();

  return (
    <TextField
      disabled={props.disabled}
      label={"Task description"}
      variant={"default"}
      defaultValue={description} //Since we set a default value and not a value, it only updates on init
      id={`taskDescription-${vsmTaskID}`}
      onChange={(event) => {
        const updatedTask: taskObject = {
          ...props.task,
          description: event.target.value.substr(0, 4000),
        };
        debounce(
          () => {
            dispatch.updateTask(updatedTask);
          },
          500,
          "SideBarContent-UpdateTask"
        )();
      }}
      multiline
      rows={5}
    />
  );
}
