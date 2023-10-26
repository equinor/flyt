import styles from "./VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { canDeleteVSMObject } from "../utils/canDeleteVSMObject";
import { vsmObject } from "../types/VsmObject";
import { close, delete_forever } from "@equinor/eds-icons";

export function SideBarHeader(props: {
  object: vsmObject;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}): JSX.Element {
  return (
    <div className={styles.headerContainer}>
      {/* TODO correct naming */}
      <Typography variant={"h2"}>{props.object?.type}</Typography>
      <div className={styles.actions}>
        <Button
          disabled={!canDeleteVSMObject(props.object) || !props.canEdit}
          title={"Delete"}
          variant={"ghost_icon"}
          color={"danger"}
          onClick={props.onDelete}
        >
          <Icon data={delete_forever} size={24} />
        </Button>
        <Button
          title={"Close the side-menu"}
          variant={"ghost_icon"}
          color={"primary"}
          onClick={props.onClose}
        >
          <Icon data={close} title="add" size={24} />
        </Button>
      </div>
    </div>
  );
}
