import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { close, delete_forever, delete_to_trash } from "@equinor/eds-icons";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { getOnChangeNameHandler } from "../pages/canvas/getOnChangeNameHandler";
import { getOnChangeRoleHandler } from "../pages/canvas/getOnChangeRoleHandler";
import { getOnChangeTimeHandler } from "../pages/canvas/getOnChangeTimeHandler";
import { getOnChangeTimeDefinitionHandler } from "../pages/canvas/getOnChangeTimeDefinitionHandler";
import { taskObject } from "../interfaces/taskObject";

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
  const dispatch = useStoreDispatch();

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
        <SideBarContent //Todo: could probably combine the sidebarContentAndVSMSideBar component... 🤔
          onChangeName={getOnChangeNameHandler(dispatch, selectedObject)}
          onChangeRole={getOnChangeRoleHandler(dispatch, selectedObject)}
          onChangeTime={getOnChangeTimeHandler(dispatch, selectedObject)}
          onChangeTimeDefinition={getOnChangeTimeDefinitionHandler(
            dispatch,
            selectedObject
          )}
          onAddTask={(task) => dispatch.addTask(task)}
          onClose={() => dispatch.setSelectedObject(null)}
          onDelete={props.onDelete}
          canEdit={props.canEdit}
        />
      </div>
    </div>
  );
}
