import React, { useEffect, useRef, useState } from "react";
import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import { VSMSideBar } from "../VSMSideBar";
import style from "../VSMCanvas.module.scss";
import { DeleteVsmObjectDialog } from "../DeleteVsmObjectDialog";
import { useAccount, useMsal } from "@azure/msal-react";
import { getUserCanEdit } from "../GetUserCanEdit";
import { loadAssets } from "./utils/LoadAssets";
import { addToolBox } from "./entities/toolbox";
import { getApp } from "./utils/app";
import { getViewPort } from "./utils/viewport";
import { initCanvas } from "./utils/InitCanvas";
import { draggable } from "./utils/draggable";
import { addCards } from "./utils/addCards";
import {
  getOnChangeName,
  getOnChangeRole,
  getOnChangeTime,
  getOnChangeTimeDefinition,
} from "./utils/vsmObjectChangeHandlers";

export default function Canvas(): JSX.Element {
  const ref = useRef();
  const selectedObject = useStoreState((state) => state.selectedObject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const userCanEdit = getUserCanEdit(account, project);

  useEffect(() => {
    if (selectedObject) {
      console.log(selectedObject.vsmObjectID);
    }
  }, [selectedObject]);

  // "Constructor"
  useEffect(() => {
    initCanvas(ref);
    const cleanupAssets = loadAssets(
      {
        choice: "/Choice.png",
        genericTaskSection: "/genericTaskSection.png",
        genericTaskSectionEdge: "/genericTaskSectionEdge.png",
        waitingTaskSection: "/waitingTaskSection.png",
        waitingTaskSectionEdge: "/waitingTaskSectionEdge.png",
        generic: "/Postit/Grey.png",
        ideaCircle: "/Idea/small/primary.png",
        unknownCircle: "/Unknown/small/primary.png",
        mainActivity: "/Postit/Blue.png",
        problemCircle: "/Problem/small/primary.png",
        questionCircle: "/Question/small/primary.png",
        subActivity: "/Postit/Yellow.png",
        subActivityStraight: "/Postit/Yellow/Straight.png",
        waiting: "/Postit/Orange/Icon.png",
        waitingStraight: "/Postit/Orange/Icon/Straight.png",
        errorCard: "/ErrorPostit.png",
      },
      () => setAssetsAreLoaded(true)
    );
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
      addCards(viewport, project, userCanEdit, dispatch);

      return () => {
        console.info("Clearing canvas");
        viewport.removeChildren();
      };
    }
  }, [project, assetsAreLoaded]);

  useEffect(() => {
    return userCanEdit
      ? addToolBox(draggable, project, dispatch)
      : () => {
          //nothing to clean up
        };
  }, [project]);

  return (
    <div style={{ backgroundColor: "blue" }}>
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
