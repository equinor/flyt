import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectFactory } from "./canvas/VsmObjectFactory";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import { vsmObject } from "../interfaces/VsmObject";
import { VSMSideBar } from "./VSMSideBar";
import { contain } from "@hapi/hoek";

export const defaultObject = {
  name: "",
  vsmObjectType: { name: "", pkObjectType: 0 },
  vsmObjectID: 0,
  time: 0,
  role: "",
} as vsmObject;

const app: Application = new Application({
  resizeTo: window,
  backgroundColor: 0xf7f7f7,
  antialias: true,
});
const viewport: Viewport = new Viewport({
  interaction: app.renderer.plugins.interaction, //Todo: Do we need this? I have no clue 👀
});

function initCanvas(ref: React.MutableRefObject<HTMLDivElement>) {
  if (isMobile) {
    viewport
      .drag()
      .pinch() // This doesn't work that well on desktop.
      .wheel()
      .decelerate({ friction: 0.4 });
  } else viewport.drag().wheel().decelerate({ friction: 0.4 });

  // add the viewport to the stage
  app.stage.addChild(viewport);

  // Add app to DOM
  ref.current.appendChild(app.view);

  app?.start();

  console.info("Initialized canvas");
}

function getViewPort() {
  return viewport;
}

function cleanupApp() {
  // Todo: Fix cleanup of app
  // console.info("Cleaning up app", { app, viewport });
  app.stage.removeChildren(); // Just to be sure, remove the current stage children ( memory leak...)
  app?.stop();
  // On unload completely destroy the application and all of it's children
  // app?.destroy(true, { children: true });
}
export default function VSMCanvas(props: {
  style?: React.CSSProperties | undefined;
  refreshProject: () => void;
}): JSX.Element {
  const ref = useRef(document.createElement("div"));
  const [selectedObject, setSelectedObject] = useState(defaultObject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);

  // "Constructor"
  useEffect(() => {
    initCanvas(ref);
    return () => cleanupApp();
  }, []);

  // "Renderer"
  useEffect(() => {
    if (project) {
      const viewport = getViewPort();
      addCards(viewport);

      return () => {
        console.info("Clearing canvas");
        viewport.removeChildren();
      };
    }
  }, [project]);

  function createTree(root: vsmObject, depth = 0): Container {
    const padding = 20;
    const cardHeight = 136;

    const container = new PIXI.Container();
    container.addChild(vsmObjectFactory(root, () => setSelectedObject(root)));
    container.y = cardHeight + padding;

    let nextX = 0;
    root.childObjects.forEach((child) => {
      const node = createTree(child, depth + 1);
      const numberOfSiblings = root.childObjects.length;
      if (numberOfSiblings === 2) {
        node.x = nextX - (node.width + padding) / numberOfSiblings;
      } else if (numberOfSiblings > 2) {
        node.x = nextX + node.width / 2;
      } else {
        node.x = nextX;
      }

      // node.x = nextX + node.width / 10;
      // // Add this group width + padding as the next x location
      nextX = nextX + node.width + padding;
      container.addChild(node);
    });

    return container;
  }

  function addCards(viewport: Viewport) {
    console.info("Adding cards to canvas", { project });
    const tree = project;
    const root = tree.objects ? tree.objects[0] : null;
    viewport.addChild(createTree(root));
  }

  function updateObjectName() {
    return (event: { target: { value: any } }) => {
      const name = event.target.value;
      setSelectedObject({ ...selectedObject, name });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, name } as vsmObject);
        },
        1000,
        "Canvas-UpdateName"
      )();
    };
  }

  function updateObjectRole() {
    return (event) => {
      const role = event.target.value;
      setSelectedObject({ ...selectedObject, role });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, role } as vsmObject);
        },
        1000,
        "Canvas-UpdateRole"
      )();
    };
  }

  function updateObjectTime() {
    return (event) => {
      const time = parseInt(event.target.value);
      setSelectedObject({ ...selectedObject, time });
      debounce(
        () => {
          dispatch.updateVSMObject({ ...selectedObject, time } as vsmObject);
        },
        1000,
        "Canvas-UpdateTime"
      )();
    };
  }

  return (
    <>
      <VSMSideBar
        onClose={() => setSelectedObject(defaultObject)}
        selectedObject={selectedObject}
        key={selectedObject.vsmObjectID}
        onChangeName={updateObjectName()}
        onChangeRole={updateObjectRole()}
        onChangeTime={updateObjectTime()}
      />
      <div style={props.style} ref={ref} />
    </>
  );
}
