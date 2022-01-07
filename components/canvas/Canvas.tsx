import { Button, Dialog, Icon, Scrim } from "@equinor/eds-core-react";
import React, { useEffect, useRef, useState } from "react";
import { getProject, resetProcess } from "../../services/projectApi";
import { moveVSMObject, postVSMObject } from "../../services/vsmObjectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { CategorizationPageButton } from "../CategorizationPageButton";
import { DeleteVsmObjectDialog } from "../DeleteVsmObjectDialog";
import { ErrorDialog } from "components/ErrorDialog";
import { LiveIndicator } from "../LiveIndicator";
import { ResetProcessButton } from "components/ResetProcessButton";
import { ResetProcessDialog } from "components/ResetProcessDialog";
import { ToBeToggle } from "./ToBeToggle";
import { VSMSideBar } from "../VSMSideBar";
import { addCardsToCanvas } from "./utils/AddCardsToCanvas";
import { assets } from "./utils/AssetFactory";
import { draggable } from "./utils/draggable";
import { getAccessToken } from "../../auth/msalHelpers";
import { getApp } from "./utils/PixiApp";
import { getMyAccess } from "../../utils/getMyAccess";
import { getViewPort } from "./utils/PixiViewport";
import { initCanvas } from "./utils/InitCanvas";
import { io } from "socket.io-client";
import { loadAssets } from "./utils/LoadAssets";
import { notifyOthers } from "../../services/notifyOthers";
import { resetCanvasZoomAndPosition } from "./utils/ResetCanvasZoomAndPosition";
import { restore } from "@equinor/eds-icons";
import style from "../VSMCanvas.module.scss";
import { toolBox } from "./entities/toolbox/toolbox";
import { unknownErrorToString } from "utils/isError";
import { useRouter } from "next/router";
import { useStoreDispatch } from "../../hooks/storeHooks";
import { vsmObject } from "interfaces/VsmObject";

export default function Canvas(): JSX.Element {
  const ref = useRef();
  const [selectedObject, setSelectedObject] = useState(null);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id, version } = router.query;

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => resetCanvasZoomAndPosition(), []);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      const socket = io({ path: "/api/socket", auth: { token: accessToken } });

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      socket.on("disconnect", (reason) => {
        dispatch.setSnackMessage(`Socket disconnected because ${reason}`);
        setSocketConnected(false);
        setSocketReason(`${reason}`);
      });

      socket.on("connect_error", (error) => {
        // if (error.data.type === "UnauthorizedError") {
        console.log("Error", error);
        setSocketConnected(false);
        setSocketReason(error.message);
        // }
      });

      socket.on(`room-${id}`, (payload) => {
        if (payload.user !== account.username?.split("@")[0]) {
          dispatch.setSnackMessage(
            `${payload.user ? payload.user : "Someone"} ${payload.msg}`
          );
        }
        queryClient.invalidateQueries();
      });
      // Handling token expiration

      return () => socket.disconnect();
    });
  }, []);

  const { data: project } = useQuery(["project", id, version], () =>
    getProject(id, version)
  );
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);
  const myAccess = getMyAccess(project, account);
  const userCanEdit = myAccess !== "Reader";

  const queryClient = useQueryClient();
  const vsmObjectMutation = useMutation(
    (newObject: vsmObject) => {
      dispatch.setSnackMessage("⏳ Moving card...");
      return moveVSMObject(newObject);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Moved card!");
        notifyOthers("Moved a card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const vsmObjectAddMutation = useMutation(
    (newObject: vsmObject) => {
      dispatch.setSnackMessage("⏳ Adding new card...");
      return postVSMObject(newObject);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Card added!");
        notifyOthers("Added a new card", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

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
      addCardsToCanvas(
        viewport,
        project,
        userCanEdit,
        dispatch,
        setSelectedObject,
        vsmObjectMutation
      );

      //Todo: Only show toolbox if userCanEdit. ref: https://equinor-sds-si.atlassian.net/browse/VSM-143
      const cleanupToolbox = userCanEdit
        ? toolBox(draggable, project, vsmObjectAddMutation, dispatch)
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
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <CategorizationPageButton userCanEdit={userCanEdit} />
      <LiveIndicator
        live={socketConnected}
        title={
          !!socketConnected
            ? "Connection is looking good!\nYour changes should appear immediately for other users."
            : `You are not connected ${
                socketReason ? `because of ${socketReason}` : ""
              }.`
        }
      />
      <ToBeToggle />
      <ResetProcessButton />
      <DeleteVsmObjectDialog
        objectToDelete={selectedObject}
        visible={visibleDeleteScrim}
        onClose={() => {
          setVisibleDeleteScrim(false);
          setSelectedObject(null);
        }}
      />

      <VSMSideBar
        onClose={() => setSelectedObject(null)}
        onDelete={() => setVisibleDeleteScrim(true)}
        canEdit={userCanEdit}
        selectedObject={selectedObject}
      />
      <div className={style.canvasWrapper} ref={ref} />
    </div>
  );
}
