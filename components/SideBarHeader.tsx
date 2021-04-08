import styles from "./VSMCanvas.module.scss";
import { Button, Icon } from "@equinor/eds-core-react";
import { canDeleteVSMObject } from "../utils/CanDeleteVSMObect";
import React from "react";
import { vsmObject } from "../interfaces/VsmObject";

export function SideBarHeader(props: {
  object: vsmObject;
  onClose: () => void;
  onDelete: () => void;
}): JSX.Element {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.sideBarHeader}>
        {props.object?.vsmObjectType.name}
      </h1>
      <div className={styles.actions}>
        <Button
          disabled={!canDeleteVSMObject(props.object)}
          title={"Delete"}
          variant={"ghost_icon"}
          color={"danger"}
          onClick={props.onDelete}
        >
          <Icon name="delete_forever" size={24} />
        </Button>
        <Button
          title={"Close the side-menu"}
          variant={"ghost_icon"}
          color={"primary"}
          onClick={props.onClose}
        >
          <Icon name="close" title="add" size={24} />
        </Button>
      </div>
    </div>
  );
}
