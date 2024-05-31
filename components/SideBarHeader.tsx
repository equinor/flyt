import styles from "./VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { canDeleteNode } from "../utils/canDeleteNode";
import { NodeDataApi } from "../types/NodeDataApi";
import { close, delete_forever } from "@equinor/eds-icons";
import { getNodeTypeName } from "utils/getNodeTypeName";

export function SideBarHeader(props: {
  object: NodeDataApi;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}): JSX.Element {
  return (
    <div className={styles.headerContainer}>
      <Typography variant={"h2"}>
        {getNodeTypeName(props.object?.type)}
      </Typography>
      <div className={styles.actions}>
        <Button
          disabled={!canDeleteNode(props.object) || !props.canEdit}
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
