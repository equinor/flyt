import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { close, delete_forever, delete_to_trash } from "@equinor/eds-icons";
import { taskObject } from "../interfaces/taskObject";
import { useStoreState } from "../hooks/storeHooks";

Icon.add({ close, delete_forever, delete_to_trash });

export function VSMSideBar(props: {
  onChangeName: (event: { target: { value: never } }) => void;
  onChangeRole: (event: { target: { value: never } }) => void;
  onChangeTime: (event: { target: { value: never } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  onAddTask: (task: taskObject) => void;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}): JSX.Element {
  const selectedObject = useStoreState((state) => state.selectedObject);

  const nothingSelected = !selectedObject;
  if (nothingSelected) return <></>;
  return (
    <div
      className={
        nothingSelected ? styles.hideSideBarToRight : styles.vsmSideMenu
      }
    >
      <div className={styles.letItBreath}>
        <SideBarContent
          onChangeName={props.onChangeName}
          onChangeRole={props.onChangeRole}
          onChangeTime={props.onChangeTime}
          onChangeTimeDefinition={props.onChangeTimeDefinition}
          onAddTask={props.onAddTask}
          onClose={props.onClose}
          onDelete={props.onDelete}
          canEdit={props.canEdit}
        />
      </div>
    </div>
  );
}
