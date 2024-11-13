import styles from "../../VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { NodeDataCommon } from "../../../types/NodeData";
import { close } from "@equinor/eds-icons";
import { getNodeTypeName } from "utils/getNodeTypeName";

export function SideBarHeader(props: {
  object: NodeDataCommon;
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
