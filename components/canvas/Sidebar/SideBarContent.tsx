import { Fragment } from "react";
import { SideBarHeader } from "./SideBarHeader";
import { SideBarBody } from "./SideBarBody";
import { NodeDataCommon } from "@/types/NodeData";
import styles from "../../VSMCanvas.module.scss";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { close as closeIcon } from "@equinor/eds-icons";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onClose: () => void;
  userCanEdit: boolean;
  selectedNode: NodeDataCommon;
  isLoading: boolean;
}) {
  const { selectedNode, onClose, isLoading, userCanEdit } = props;

  if (isLoading) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.sideBarLoadingText}>
          <Typography variant={"h1"}>Loading...</Typography>
        </div>
        <div className={styles.actions}>
          <Button
            title={"Close the side-menu"}
            variant={"ghost_icon"}
            color={"primary"}
            onClick={onClose}
          >
            <Icon data={closeIcon} title="add" size={24} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Fragment key={selectedNode?.id}>
      <SideBarHeader
        object={selectedNode}
        onClose={onClose}
        canEdit={userCanEdit}
      />
      <SideBarBody selectedNode={selectedNode} userCanEdit={userCanEdit} />
    </Fragment>
  );
}
