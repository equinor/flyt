import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectFactory } from "./canvas/VsmObjectFactory";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import { vsmObject } from "../interfaces/VsmObject";
import { VSMSideBar } from "./VSMSideBar";

export const defaultObject = {
  name: "",
  vsmObjectType: { name: "", pkObjectType: 0 },
  vsmObjectID: 0,
  time: 0,
  role: ""
} as vsmObject;

export default function VSMCanvas(props: {
  style?: React.CSSProperties | undefined;
  refreshProject: () => void;
}): JSX.Element {
  const ref = useRef(document.createElement("div"));
  const [selectedObject, setSelectedObject] = useState(defaultObject);
  const dispatch = useStoreDispatch();
  const project = useStoreState(state => state.project);
  const [viewPortPosition, setViewPortPosition] = useState({ y: 0, x: 0 });

  //Let's have an constructor for the app, then just refreshing the content when needed. Now we are creating a new app everytime when the project updates... haha
  useEffect(() => {
    if (project) {
      const app = new Application({
        resizeTo: window,
        backgroundColor: 0xf7f7f7,
        antialias: true
      });
      const viewport = new Viewport({ interaction: app.renderer.plugins.interaction });

      // activate plugins
      if (isMobile) {
        viewport
          .drag()
          .pinch() // This doesn't work that well on desktop.
          .wheel()
          .decelerate({ friction: 0.15 });
      } else viewport.drag().wheel().decelerate({ friction: 0.15 });

      // Set position to last known position (This fixes reset after loading new data)
      viewport.x = viewPortPosition.x;
      viewport.y = viewPortPosition.y;

      viewport.on("moved-end", () => {
        setViewPortPosition({ x: viewport.x, y: viewport.y }); // Todo: Fix zoom
      });

      //Todo: Improve this hack
      viewport.on("clicked", () => {
        setSelectedObject(defaultObject);
      });

      // add the viewport to the stage
      app.stage.addChild(viewport);

      //// View was a bit too high. So removing 4px from it. But this doesn't work after resizing the view...So Todo: improve
      app.view.height = app.view.height - 70; // <-  Hack to remove scrollbar.

      // Add app to DOM
      ref.current.appendChild(app.view);

      // Start the PixiJS app
      app.start();

      const rootObject = project.objects ? project.objects[0] : null;
      const levelOne = new PIXI.Container();
      if (rootObject) {
        levelOne.addChild(
          vsmObjectFactory(rootObject, () =>
            setTimeout(() => setSelectedObject(rootObject), 10)
          )
        );
      }

      const levelTwo = new PIXI.Container();
      let nextX = 0;
      rootObject?.childObjects
        .map(
          (o: vsmObject) => {
            const onPress = () => setTimeout(() => setSelectedObject(o), 10);
            return vsmObjectFactory(o, onPress);
          }
        )
        .forEach((c: PIXI.Graphics) => {
          const padding = 10;
          if (nextX) c.x = nextX;
          nextX = c.x + c.width + padding * 2;
          return levelTwo.addChild(c);
        });

      levelTwo.y = 300;
      levelTwo.x = 150;
      levelOne.x = levelTwo.width / 2 + levelOne.width / 2 + 23.5; //Todo: figure out better logic for centering
      levelOne.y = levelTwo.y - 200;
      viewport.addChild(
        // projectText,
        levelOne,
        levelTwo
      );

      return () => {
        app.stop();
        // On unload completely destroy the application and all of it's children
        app.destroy(true, { children: true });
      };
    }
  }, [project]);
  
  function updateObjectName() {
    return (event: { target: { value: any } }) => {
      const name = event.target.value;
      setSelectedObject({ ...selectedObject, name });
      debounce(() => {
          dispatch.updateVSMObject({ ...selectedObject, name } as vsmObject);
        }, 1000, "Canvas-UpdateName"
      )();
    };
  }

  function updateObjectRole() {
    return (event) => {
      const role = event.target.value;
      setSelectedObject({ ...selectedObject, role });
      debounce(() => {
          dispatch.updateVSMObject({ ...selectedObject, role } as vsmObject);
        }, 1000, "Canvas-UpdateRole"
      )();
    };
  }

  function updateObjectTime() {
    return (event) => {
      const time = parseInt(event.target.value);
      setSelectedObject({ ...selectedObject, time });
      debounce(() => {
          dispatch.updateVSMObject({ ...selectedObject, time } as vsmObject);
        }, 1000, "Canvas-UpdateTime"
      )();
    };
  }

  return (
    <>
      <VSMSideBar
        selectedObject={selectedObject}
        onChangeName={updateObjectName()}
        onChangeRole={updateObjectRole()}
        onChangeTime={updateObjectTime()}
      />
      <div style={props.style} ref={ref} />
    </>
  );
}
