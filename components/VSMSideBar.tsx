import { vsmObject } from "../interfaces/VsmObject";
import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { defaultObject } from "./VSMCanvas";
import { Button, Icon } from "@equinor/eds-core-react";
import { close, delete_forever } from "@equinor/eds-icons";
import { canDeleteVSMObject } from "../store/store";

Icon.add({ close, delete_forever });

export function VSMSideBar(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: never } }) => void;
  onChangeRole: (event: { target: { value: never } }) => void;
  onChangeTime: (event: { target: { value: never } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={
        props.selectedObject === defaultObject
          ? styles.hideSideBarToRight
          : styles.vsmSideMenu
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
            disabled={!canDeleteVSMObject(props.selectedObject)}
            title={"Delete"}
            variant={"ghost_icon"}
            color={"danger"}
            onClick={props.onDelete}
          >
            <Icon name="delete_forever" size={16} />
          </Button>
        </div>
        <h1 className={styles.sideBarHeader}>
          {props.selectedObject.vsmObjectType.name}
        </h1>
        <SideBarContent
          selectedObject={props.selectedObject}
          onChangeName={props.onChangeName}
          onChangeRole={props.onChangeRole}
          onChangeTime={props.onChangeTime}
          onChangeTimeDefinition={props.onChangeTimeDefinition}
        />
      </div>
    </div>
  );
}
