import { NodeDataCommon } from "@/types/NodeData";
import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { close as closeIcon } from "@equinor/eds-icons";
import { Fragment, useState } from "react";
import { unknownErrorToString } from "utils/isError";
import { useVSMObjectMutation } from "./canvas/hooks/useVSMObjectMutation";
import { NewTaskSection } from "./NewTaskSection";
import { SideBarBody } from "./SideBarBody";
import { SideBarHeader } from "./SideBarHeader";
import styles from "./VSMCanvas.module.scss";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedNode: NodeDataCommon;
  isLoading: boolean;
}) {
  const { patchDescription, patchDuration, patchRole, error } =
    useVSMObjectMutation(props.selectedNode);

  const selectedNode = props.selectedNode;
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);

  if (props.isLoading) {
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
            onClick={props.onClose}
          >
            <Icon data={closeIcon} title="add" size={24} />
          </Button>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.sideBarLoadingText}>
        <div className={styles.headerContainer}>
          <Typography variant={"h1"}>Oups! We have an error.</Typography>
          <div className={styles.actions}>
            <Button
              title={"Close the side-menu"}
              variant={"ghost_icon"}
              color={"primary"}
              onClick={props.onClose}
            >
              <Icon data={closeIcon} title="add" size={24} />
            </Button>
          </div>
        </div>
        <p>{unknownErrorToString(error)}</p>
      </div>
    );
  }

  if (showNewTaskSection)
    return (
      <NewTaskSection
        onClose={() => setShowNewTaskSection(false)}
        selectedNode={selectedNode}
      />
    );

  return (
    <Fragment key={selectedNode?.id}>
      <SideBarHeader
        object={selectedNode}
        onClose={props.onClose}
        onDelete={props.onDelete}
        canEdit={props.canEdit}
      />
      <SideBarBody
        selectedNode={selectedNode}
        onChangeDescription={patchDescription}
        onChangeRole={(e) => patchRole(e.target.value)}
        onChangeDuration={(e) => patchDuration(e.duration, e.unit)}
        setShowNewTaskSection={setShowNewTaskSection}
        canEdit={props.canEdit}
      />
    </Fragment>
  );
}
