import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { vsmObject } from "../interfaces/VsmObject";
import { useQuery } from "react-query";
import { getVSMObject } from "../services/vsmObjectApi";

export function VSMSideBar(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedObject: vsmObject;
}): JSX.Element {
  const selectedObject = props.selectedObject;

  // Fetch selected vsmObjects
  const vsmObjectId = selectedObject?.vsmObjectID;
  const { data: vsmObject, isLoading } = useQuery(
    ["selectedObject", vsmObjectId],
    () => getVSMObject(vsmObjectId)
    // { enabled: vsmObjectId  }
  );

  const nothingSelected = !selectedObject;
  if (nothingSelected) return <></>;
  return (
    <div>
      <div
        onWheel={(event) => event.stopPropagation()}
        className={
          nothingSelected ? styles.hideSideBarToRight : styles.vsmSideMenu
        }
      >
        <div className={styles.letItBreath}>
          <SideBarContent
            onClose={props.onClose}
            onDelete={props.onDelete}
            canEdit={props.canEdit}
            selectedObject={vsmObject}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className={styles.sideBarBackgroundCover} onClick={props.onClose} />
    </div>
  );
}
