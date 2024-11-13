import styles from "../../VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import { NodeDataCommon } from "../../../types/NodeData";

export function SideBar(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedNode?: NodeDataCommon;
}): JSX.Element {
  const selectedNode = props.selectedNode;
  if (!selectedNode) return <></>;
  return (
    <div className={styles.sideBarBackgroundCover} onClick={props.onClose}>
      <div
        onWheel={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        className={styles.vsmSideMenu}
      >
        <div className={styles.letItBreath}>
          <SideBarContent
            onClose={props.onClose}
            onDelete={props.onDelete}
            canEdit={props.canEdit}
            selectedNode={selectedNode}
            isLoading={!selectedNode}
          />
        </div>
      </div>
    </div>
  );
}
