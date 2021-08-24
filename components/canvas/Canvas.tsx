import React, { useEffect, useRef, useState } from "react";
import { useStoreDispatch } from "../../hooks/storeHooks";
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
import { getMyAccess } from "../../utils/getMyAccess";
import { assets } from "./utils/AssetFactory";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getProject } from "../../services/projectApi";
import { useRouter } from "next/router";
import { moveVSMObject, postVSMObject } from "../../services/vsmObjectApi";
import { vsmObject } from "interfaces/VsmObject";
import { unknownErrorToString } from "utils/isError";
import { io } from "socket.io-client";
import { notifyOthers } from "../../services/notifyOthers";
import { getAccessToken } from "../../auth/msalHelpers";

export default function Canvas(): JSX.Element {
  const ref = useRef();
  const [selectedObject, setSelectedObject] = useState(null);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id } = router.query;
  // function notifyOthers(
  //   socket: any,
  //   eventType: string,
  //   user: string,
  //   project: number
  // ) {
  //   const payload = { user, project, eventType };
  //   socket.emit(eventType, payload);
  // }
  useEffect(() => {
    getAccessToken().then((accessToken) => {
      const socket = io({ path: "/api/socket", auth: { token: accessToken } });

      socket.on("connect", () => {
        console.log("Socket connected!");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnect", reason);
      });

      socket.on(`room-${id}`, (message) => {
        console.log({ message });
        queryClient.invalidateQueries();
      });

      // Handling token expiration
      socket.on("connect_error", (error) => {
        // if (error.data.type === "UnauthorizedError") {
        console.log("Error", error);
        // }
      });
      socket.onAny((message) => console.log({ message }));
      socket.emit(`room-${id}`, { message: "Hello!" });

      socket.send("Hello!");

      return () => socket.disconnect();
    });
  }, []);

  const { data: project } = useQuery(["project", id], () => getProject(id));

  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);
  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project, account);
  const userCanEdit = myAccess === "Admin" || myAccess === "Contributor";

  const queryClient = useQueryClient();
  const vsmObjectMutation = useMutation(
    (newObject: vsmObject) => {
      dispatch.setSnackMessage("⏳ Moving card...");
      return moveVSMObject(newObject);
    },
    {
      onSuccess: () => {
        dispatch.setSnackMessage("✅ Moved card!");
        notifyOthers("✅ Moved card!!", id, account);
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
        notifyOthers("✅ Card added!", id, account);
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
    <div style={{ backgroundColor: "black" }}>
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
