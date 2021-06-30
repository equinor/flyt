import React, { useEffect, useRef, useState } from "react";
import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import { VSMSideBar } from "../VSMSideBar";
import style from "../VSMCanvas.module.scss";
import { DeleteVsmObjectDialog } from "../DeleteVsmObjectDialog";
import { useAccount, useMsal } from "@azure/msal-react";
import { loadAssets } from "./utils/LoadAssets";
import { toolBox } from "./entities/toolbox/toolbox";
import { getApp } from "./utils/PixiApp";
import { getViewPort } from "./utils/PixiViewport";
import { initCanvas } from "./utils/InitCanvas";
import { draggable } from "./utils/draggable";
import { addCardsToCanvas } from "./utils/AddCardsToCanvas";
import {
  getOnChangeName,
  getOnChangeRole,
  getOnChangeTime,
  getOnChangeTimeDefinition,
} from "./utils/vsmObjectChangeHandlers";
import { getMyAccess } from "../../utils/getMyAccess";
import { assets } from "./utils/AssetFactory";
import { Button, Icon } from "@equinor/eds-core-react";
import { download_tree_as_png } from "./utils/downloadVSMImage";

export default function Canvas(): JSX.Element {
  const ref = useRef();
  const selectedObject = useStoreState((state) => state.selectedObject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project, account);
  const userCanEdit = myAccess === "Admin" || myAccess === "Contributor";

  // "Constructor"
  useEffect(() => {
    initCanvas(ref);
    const cleanupAssets = loadAssets(assets, () => setAssetsAreLoaded(true));
    return () => {
      cleanupAssets();
      getApp().stage.removeChildren();
      getApp()?.stop();
    };
  }, []);

  // "Renderer"
  useEffect(() => {
    if (project && assetsAreLoaded) {
      const viewport = getViewPort();
      addCardsToCanvas(viewport, project, userCanEdit, dispatch);

      //Todo: Only show toolbox if userCanEdit. ref: https://equinor-sds-si.atlassian.net/browse/VSM-143
      const cleanupToolbox = userCanEdit
        ? toolBox(draggable, project, dispatch)
        : () => {
            //nothing to clean up
          };

      return () => {
        // Clearing canvas
        viewport.removeChildren();
        cleanupToolbox();
      };
    }
  }, [project, assetsAreLoaded]);

  return (
    <div style={{ backgroundColor: "black" }}>
      <DeleteVsmObjectDialog
        objectToDelete={selectedObject}
        visible={visibleDeleteScrim}
        onClose={() => setVisibleDeleteScrim(false)}
      />

      <VSMSideBar
        //Todo: Clean it up! Move onChange-props inside the component.
        onClose={() => dispatch.setSelectedObject(null)}
        onChangeName={getOnChangeName(dispatch, selectedObject)}
        onChangeRole={getOnChangeRole(dispatch, selectedObject)}
        onChangeTime={getOnChangeTime(dispatch, selectedObject)}
        onChangeTimeDefinition={getOnChangeTimeDefinition(
          dispatch,
          selectedObject
        )}
        onDelete={() => setVisibleDeleteScrim(true)}
        onAddTask={(task) => dispatch.addTask(task)}
        canEdit={userCanEdit}
      />
      <div className={style.canvasWrapper} ref={ref} />
    </div>
  );
}
