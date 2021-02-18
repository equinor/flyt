import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectFactory } from "./canvas/VsmObjectFactory";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import styles from "./VSMCanvas.module.scss";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { debounce } from "../utils/debounce";
import { vsmObject } from "../interfaces/VsmObject";
import { SingleSelect, TextField } from "@equinor/eds-core-react";

const defaultObject = {
  name: "",
  vsmObjectType: { name: "", pkObjectType: 0 },
  vsmObjectID: 0,
  time: 0,
  role: ""
} as vsmObject;

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
function SideBarContent(props: {
  selectedObject: vsmObject,
  name: string,
  pkObjectType: vsmObjectTypes,
  onChangeName: (event: { target: { value: string } }) => void,
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
}) {
  switch (props.pkObjectType) {
    case vsmObjectTypes.process:
      return <>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label={"Title"}
            multiline
            rows={4}
            variant={"default"}
            value={props.selectedObject.name}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
        </div>
      </>;
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
      return <>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label={"Add description"}
            multiline
            rows={4}
            variant={"default"}
            value={props.selectedObject.name}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
        </div>
      </>;
    case vsmObjectTypes.mainActivity:
    case vsmObjectTypes.subActivity:
      return <>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label={"Add description"}
            multiline
            rows={4}
            variant={"default"}
            value={props.selectedObject.name}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
        </div>
        <div style={{ paddingTop: 12 }}>
          <TextField
            label={"Role"}
            variant={"default"}
            value={props.selectedObject.role?.toString()}
            id={"vsmObjectRole"}
            onChange={props.onChangeRole}
          />
          <div style={{ padding: 8 }} />
          <TextField
            type={"number"}
            label={"Duration"}
            meta={"Minutes"}
            value={props.selectedObject.time?.toString()}
            id={"vsmObjectTime"}
            onChange={props.onChangeTime}
          />
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
          handleSelectedItemChange={() => {
          }}
          label="Select type"
        />
      </>;
    case vsmObjectTypes.waiting:
      return <>
        <TextField
          type={"number"}
          label={"Duration"}
          meta={"Minutes"}
          value={props.selectedObject.time?.toString()}
          id={"vsmObjectTime"}
          onChange={props.onChangeTime}
        />
      </>;
    case vsmObjectTypes.choice:
      return <>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label={"Title"}
            multiline
            rows={4}
            variant={"default"}
            value={props.selectedObject.name}
            onChange={props.onChangeName}
            id={"vsmObjectDescription"}
          />
        </div>
      </>;
    default:
      return <p>Invalid process type</p>;
  }
}

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
        <SideBarContent
          selectedObject={selectedObject} name={name} pkObjectType={pkObjectType}
          onChangeName={(event: { target: { value: any } }) => {
            const name = event.target.value;
            setSelectedObject({ ...selectedObject, name });
            debounce(() => {
                dispatch.updateVSMObject({ ...selectedObject, name } as vsmObject);
              }, 1000, "Canvas-UpdateName"
            )();
          }}
          onChangeRole={(event) => {
            console.log(event.target.value);
            const role = event.target.value;
            setSelectedObject({ ...selectedObject, role });
            debounce(() => {
                dispatch.updateVSMObject({ ...selectedObject, role } as vsmObject);
              }, 1000, "Canvas-UpdateRole"
            )();
          }}
          onChangeTime={(event) => {
            console.log(event.target.value);
            const time = parseInt(event.target.value);
            setSelectedObject({ ...selectedObject, time });
            debounce(() => {
                dispatch.updateVSMObject({ ...selectedObject, time } as vsmObject);
              }, 1000, "Canvas-UpdateTime"
            )();
          }} />
      </div>
      <div style={props.style} ref={ref} />
    </>
  );
}
