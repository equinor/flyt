import { Button, Icon } from "@equinor/eds-core-react";
import { download_tree_as_png } from "./utils/downloadVSMImage";
import React, { useEffect, useState } from "react";
import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import { useAccount, useMsal } from "@azure/msal-react";
import { getMyAccess } from "../../utils/getMyAccess";
import { loadAssets } from "./utils/LoadAssets";
import { assets } from "./utils/AssetFactory";
import { getApp } from "./utils/PixiApp";

export default function Download() {
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
    const cleanupAssets = loadAssets(assets, () => setAssetsAreLoaded(true));
    return () => {
      cleanupAssets();
      getApp().stage.removeChildren();
      getApp()?.stop();
    };
  }, []);

  // "Renderer"
  // useEffect(() => {
  //   if (project && assetsAreLoaded) {
  //     const viewport = getViewPort();
  //     addCardsToCanvas(viewport, project, userCanEdit, dispatch);
  //
  //     //Todo: Only show toolbox if userCanEdit. ref: https://equinor-sds-si.atlassian.net/browse/VSM-143
  //     const cleanupToolbox = userCanEdit
  //       ? toolBox(draggable, project, dispatch)
  //       : () => {
  //           //nothing to clean up
  //         };
  //
  //     return () => {
  //       // Clearing canvas
  //       viewport.removeChildren();
  //       cleanupToolbox();
  //     };
  //   }
  // }, [project, assetsAreLoaded]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 200,
      }}
    >
      <Button
        variant={"contained"}
        title={"Download VSM"}
        onClick={() => download_tree_as_png(project)}
      >
        <Icon name={"download"} />
        Download
      </Button>
    </div>
  );
}
