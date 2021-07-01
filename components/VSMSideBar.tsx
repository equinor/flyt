import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { close, delete_forever, delete_to_trash } from "@equinor/eds-icons";
import { vsmObject } from "../interfaces/VsmObject";
import { useQuery } from "react-query";
import { getVSMObject } from "../services/vsmObjectApi";

Icon.add({ close, delete_forever, delete_to_trash });

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
    () => getVSMObject(vsmObjectId),
    { enabled: !!vsmObjectId }
  );

  const nothingSelected = !selectedObject;
  if (nothingSelected) return <></>;
  return (
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
  );
}
