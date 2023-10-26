import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import { vsmObject } from "../types/VsmObject";

export function VSMSideBar(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedNode?: vsmObject;
}): JSX.Element {
  const selectedNode = props.selectedNode;
  if (!selectedNode) return <></>;
  return (
    <div>
      <div
        onWheel={(event) => event.stopPropagation()}
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
      <div className={styles.sideBarBackgroundCover} onClick={props.onClose} />
    </div>
  );
}
