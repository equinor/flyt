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
import { SignalRService } from "../../services/signalRService";
import { setUpSignalRConnection } from "../../services/setUpSignalRConnection";
import { signalRActionTypes } from "../../types/signalRActionTypes";

export default function Canvas(): JSX.Element {
  const ref = useRef();
  const [selectedObject, setSelectedObject] = useState(null);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const s = new SignalRService(parseInt(id.toString(), 10), {
        onDeleteObject: (e) => console.log("onDeleteObject", e),
        onDeleteProject: (e) => console.log("onDeleteProject", e),
        onDeleteTask: (e) => console.log("onDeleteTask", e),
        onSaveProject: (e) => console.log("onSaveProject", e),
        onSaveTask: (e) => console.log("onSaveTask", e),
        onUpdateObject: (e) => console.log("onUpdateObject", e),
      });
      // const s = new SignalRService(parseInt(id));
      // const s = setUpSignalRConnection(parseInt(id.toString(), 10));
      // setUpSignalRConnection(parseInt(id.toString())).then((connection) => {
      //   connection.on(signalRActionTypes.SaveProject, (data) => {
      //     console.log("SaveProject", data);
      //   });
      //   connection.on(signalRActionTypes.DeleteProject, (data) => {
      //     console.log("DeleteProject", data);
      //     alert(
      //       "This VSM was deleted. We will now navigate you back to the start-page"
      //     );
      //     router.push("/");
      //   });
      //   connection.on(signalRActionTypes.UpdateObject, (data) => {
      //     console.log("UpdateObject", data);
      //     // dispatch.fetchProject({ id });
      //   });
      //   connection.on(signalRActionTypes.DeletedObject, (data) => {
      //     console.log("DeletedObject", data);
      //     // dispatch.fetchProject({ id });
      //   });
      //   connection.on(signalRActionTypes.SaveTask, (data) => {
      //     console.log("DeletedObject", data);
      //     // dispatch.fetchProject({ id });
      //   });
      //   connection.on(signalRActionTypes.DeleteTask, (data) => {
      //     console.log("DeletedObject", data);
      //     // dispatch.fetchProject({ id });
      //   });
      // });
      return s.disconnect;
    }
  }, [id]);

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
        onClose={() => setVisibleDeleteScrim(false)}
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
