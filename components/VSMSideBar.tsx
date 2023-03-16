import styles from "./VSMCanvas.module.scss";
import { SideBarContent } from "./SideBarContent";
import React from "react";
import { vsmObject } from "../interfaces/VsmObject";
import { useQuery } from "react-query";
import { getVSMObject } from "../services/vsmObjectApi";
import { useRouter } from "next/router";

export function VSMSideBar(props: {
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
  selectedObject: vsmObject;
}): JSX.Element {
  const selectedObject = props.selectedObject;

  // Only fetch the selected object if we are showing the "now" version
  // We can figure that out by checking if the router query includes a version value.
  // (It should not be present if we are showing the "now" version)
  const router = useRouter();
  const shouldFetch = false; //!(router.query.version as string);

  // Fetch selected fetchedVSMObject
  const id = selectedObject?.id;
  const { data: fetchedVSMObject, isLoading } = useQuery(
    ["selectedObject", id],
    () => getVSMObject(id),
    {
      enabled: shouldFetch,
    }
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
            selectedObject={shouldFetch ? fetchedVSMObject : selectedObject}
            isLoading={shouldFetch && isLoading}
          />
        </div>
      </div>
      <div className={styles.sideBarBackgroundCover} onClick={props.onClose} />
    </div>
  );
}
