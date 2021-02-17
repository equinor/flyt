import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectFactory } from "./canvas/VsmObjectFactory";
import { SingleSelect, TextField } from "@equinor/eds-core-react";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import styles from "./VSMCanvas.module.scss";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import { vsmObject } from "../interfaces/VsmObject";

const defaultObject = {
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

      // AddRotatingBunnies(app);
      // GenericPostit({
      //   app: app,
      // });

      const projectName = project.name;
      //Todo: Add title to stage
      const defaultStyle = {
        fontFamily: "Equinor",
        fontWeight: 500,
        fontSize: 24,
        lineHeight: 16,
        letterSpacing: 0.2,
        wordWrapWidth: 400,
        wordWrap: true,
        breakWords: true,
        trim: true
      };
      //
      // const projectText = new PIXI.Text(
      //   formatCanvasText(projectName, 200),
      //   defaultStyle
      // );
      // projectText.alpha = 0.4;
      // projectText.resolution = 4;
      // projectText.x = 50 - viewport.x;
      // projectText.y = 100 - viewport.y;
      // viewport.on("moved", () => {
      //   projectText.x = 50 - viewport.x;
      //   projectText.y = 100 - viewport.y;
      //   // setViewPortPosition({ x: viewport.x, y: viewport.y }); // Todo: Fix zoom
      // });

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

  const { pkObjectType, name } = selectedObject.vsmObjectType;
  return (
    <>
      <div
        className={
          selectedObject === defaultObject
            ? styles.hideSideBarToRight
            : styles.vsmSideMenu
        }
      >
        <h1 className={styles.sideBarHeader}>{name}</h1>
        <div className={styles.sideBarSectionHeader}>
          <p>General Information</p>
        </div>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label={"Add description"}
            multiline
            rows={4}
            variant={"default"}
            value={selectedObject.name}
            onChange={(event: { target: { value: any } }) => {
              const newName = event.target.value;
              setSelectedObject({ ...selectedObject, name: newName });
              debounce(() => {
                  dispatch.updateVSMObject({ ...selectedObject, name: newName } as vsmObject);
                }, 1000, "Canvas-UpdateName"
              )();
            }}
            id={"vsmObjectDescription"}
          />
        </div>
        <div style={{ display: "flex", paddingTop: 10 }}>
          {
            (pkObjectType === vsmObjectTypes.mainActivity
              || pkObjectType === vsmObjectTypes.subActivity)
            && (
              <>
                <TextField
                  disabled
                  label={"Role"}
                  variant={"default"}
                  value={selectedObject.role?.toString() ?? "Role"}
                  id={"vsmObjectRole"}
                />
                <div style={{ padding: 8 }} />
                <TextField
                  disabled
                  label={"Time"}
                  value={selectedObject.time?.toString() ?? "1 min"}
                  variant={"default"}
                  id={"vsmObjectTime"}
                />
              </>
            )
          }
        </div>
        <div className={styles.sideBarSectionHeader}>
          <p>Add problem, idea or question</p>
        </div>
        <SingleSelect
          disabled
          items={[
            "Problem",
            "Idea",
            "Question",
            "Existing Problem",
            "Existing Idea",
            "Existing Question"
          ]}
          handleSelectedItemChange={(changes) => console.log(changes)}
          label="Select type"
        />

        {/*Todo: Add accordion */}
        {/*<div className={styles.sideBarSectionHeader}>*/}
        {/*  <p>Debug section</p>*/}
        {/*</div>*/}
        {/*NB: ReactJson is really slow, so better to no render it every render*/}
        {/*<ReactJson src={selectedObject} theme={'apathy:inverted'} />*/}
      </div>
      <div style={props.style} ref={ref} />
    </>
  );
}
