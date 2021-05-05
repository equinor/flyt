import React, { useEffect, useRef } from "react";
import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import { VSMSideBar } from "../../components/VSMSideBar";
import { DeleteVsmObjectDialog } from "../../components/DeleteVsmObjectDialog";
import { setupCanvas } from "./setupCanvas";
import { addCardsToCanvas } from "./addCardsToCanvas";
import { addToolBox } from "../../components/AddToolBox";
import { cleanup } from "./cleanup";

export default function Canvas(): JSX.Element {
  const canvasRef = useRef(null);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);
  const selectedObject = useStoreState((state) => state.selectedObject);
  const hoveredObject = useStoreState((state) => state.hoveredObject);
  const [visibleDeleteScrim, setVisibleDeleteScrim] = React.useState(false);

  const [app, setApp] = React.useState(null);

  const [viewport, setViewport] = React.useState(null);

  useEffect(() => {
    // Canvas setup
    // Handle the creation and cleanup of the vsm-canvas.
    const { app, viewport } = setupCanvas(canvasRef);
    setApp(app);
    setViewport(viewport);
    return () => {
      console.info("cleanup canvas");
      cleanup(viewport, app);
    };
  }, [project?.vsmProjectID]);

  useEffect(() => {
    // Canvas content
    if (app && viewport && project) {
      const cleanupCards = addCardsToCanvas(project, viewport, dispatch);
      const cleanupToolbox = addToolBox(
        app,
        viewport,
        dispatch,
        hoveredObject,
        project
      );
      return () => {
        console.info("cleanup content");
        cleanupCards();
        cleanupToolbox();
      };
    }
  }, [app, viewport, project?.objects[0]?.childObjects]);

  return (
    <>
      {visibleDeleteScrim && (
        <DeleteVsmObjectDialog
          objectToDelete={selectedObject}
          onClose={() => setVisibleDeleteScrim(false)}
        />
      )}
      <VSMSideBar onDelete={() => setVisibleDeleteScrim(true)} />
      <div ref={canvasRef} />
    </>
  );
}
