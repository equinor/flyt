import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import { vsmObject } from "../types/VsmObject";

export function VSMSideBar(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedObject?: vsmObject;
}): JSX.Element {
  const selectedObject = props.selectedObject;
  if (!selectedObject) return <></>;
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
            selectedObject={selectedObject}
            isLoading={!selectedObject}
          />
        </div>
      </div>
      <div className={styles.sideBarBackgroundCover} onClick={props.onClose} />
    </div>
  );
}
