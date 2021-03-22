import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { close, delete_forever, delete_to_trash } from "@equinor/eds-icons";
import { taskObject } from "../interfaces/taskObject";
import { canDeleteVSMObject } from "../utils/CanDeleteVSMObect";
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
}) {
  const selectedObject = useStoreState((state) => state.selectedObject);

  const nothingSelected = !selectedObject;
  if (nothingSelected) return <></>;
  return (
    <div
      onWheel={(event) => event.stopPropagation()}
      className={
        nothingSelected ? styles.hideSideBarToRight : styles.vsmSideMenu
      }
    >
      <div className={styles.letItBreath}>
        <div className={styles.actions}>
          <Button
            title={"Close the side-menu"}
            variant={"ghost_icon"}
            color={"primary"}
            onClick={props.onClose}
          >
            <Icon name="close" title="add" size={16} />
          </Button>
          <Button
            disabled={!canDeleteVSMObject(selectedObject)}
            title={"Delete"}
            variant={"ghost_icon"}
            color={"danger"}
            onClick={props.onDelete}
          >
            <Icon name="delete_forever" size={16} />
          </Button>
        </div>
        <h1 className={styles.sideBarHeader}>
          {selectedObject?.vsmObjectType.name}
        </h1>
        <SideBarContent
          onChangeName={props.onChangeName}
          onChangeRole={props.onChangeRole}
          onChangeTime={props.onChangeTime}
          onChangeTimeDefinition={props.onChangeTimeDefinition}
          onAddTask={props.onAddTask}
        />
      </div>
    </div>
  );
}
