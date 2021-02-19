import { vsmObject } from "../interfaces/VsmObject";
import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { defaultObject } from "./VSMCanvas";

export function VSMSideBar(props: {
  selectedObject: vsmObject;
  onChangeName: (event: { target: { value: any } }) => void;
  onChangeRole: (event) => void;
  onChangeTime: (event) => void;
}) {
  return (
    <div
      className={
        props.selectedObject === defaultObject
          ? styles.hideSideBarToRight
          : styles.vsmSideMenu
      }
    >
      <h1 className={styles.sideBarHeader}>
        {props.selectedObject.vsmObjectType.name}
      </h1>
      <SideBarContent
        selectedObject={props.selectedObject}
        onChangeName={props.onChangeName}
        onChangeRole={props.onChangeRole}
        onChangeTime={props.onChangeTime}
      />
    </div>
  );
}
