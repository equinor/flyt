import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { GenericPostit } from "./canvas/GenericPostit";
import MainActivity from "./canvas/entities/MainActivity";
import { Viewport } from "pixi-viewport";
import { isMobile } from "react-device-detect";
import { vsmObjectTypes } from "../pages/VsmObjectTypes";
import SubActivity from "./canvas/entities/SubActivity";
import Waiting from "./canvas/entities/Waiting";
import { truncateText } from "./canvas/TruncateText";

function vsmObjectFactory(o: {
  name: string;
  vsmObjectType: { name: string; pkObjectType: number };
}): PIXI.DisplayObject {
  const { pkObjectType, name } = o.vsmObjectType;
  switch (pkObjectType) {
    case vsmObjectTypes.process:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
      return GenericPostit({
        header: name,
        content: o.name,
        options: {
          x: 0,
          y: 0,
          width: 126,
          height: 136,
          color: 0x00d889,
          scale: 1,
        },
      });
    case vsmObjectTypes.mainActivity:
      return MainActivity({ x: 0, y: 0, content: name });
    case vsmObjectTypes.subActivity:
      return SubActivity({ x: 0, y: 0, content: name });
    case vsmObjectTypes.waiting:
      return Waiting("3 min", 0, 28, () => console.log("Clicked"));
    default:
      return GenericPostit({
        header: "ERROR",
        content: "Could not find matching object type",
        options: {
          x: 0,
          y: 0,
          width: 126,
          height: 136,
          color: 0xff1243,
          scale: 1,
        },
      });
  }
}

export function VSMCanvas(props: {
  style?: React.CSSProperties | undefined;
  data: any;
}): JSX.Element {
  const ref = useRef(document.createElement("div"));

  useEffect(() => {
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    // PIXI.settings.ROUND_PIXELS = true;
    const app = new Application({
      resizeTo: window,
      backgroundColor: 0xf7f7f7,
      antialias: true,
    });

    const viewport = new Viewport({
      interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // add the viewport to the stage
    app.stage.addChild(viewport);
    // activate plugins
    if (isMobile) {
      viewport
        .drag()
        .pinch() // This doesn't work that well on desktop.
        .wheel()
        .decelerate({ friction: 0.15 });
    } else viewport.drag().wheel().decelerate({ friction: 0.15 });

    // Add app to DOM
    ref.current.appendChild(app.view);

    // Start the PixiJS app
    app.start();

    // AddRotatingBunnies(app);
    // GenericPostit({
    //   app: app,
    // });

    const projectName = props.data.name;
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
      trim: true,
    };

    const projectText = new PIXI.Text(
      truncateText(projectName, 200),
      defaultStyle
    );
    projectText.x = viewport.x;
    projectText.y = viewport.y;
    projectText.alpha = 0.4;
    projectText.resolution = 4;

    console.log(props.data);
    const rootObject = props.data.objects ? props.data.objects[0] : null;
    const levelOne = new PIXI.Container();
    if (rootObject) {
      levelOne.addChild(vsmObjectFactory(rootObject));
    }

    const levelTwo = new PIXI.Container();
    rootObject?.childObjects
      .map(
        (o: {
          name: string;
          vsmObjectType: { name: string; pkObjectType: number };
        }) => {
          return vsmObjectFactory(o);
        }
      )
      .forEach((c: PIXI.Graphics, i: number) => {
        c.x = i * 180;
        return levelTwo.addChild(c);
      });

    levelTwo.y = 300;
    levelTwo.x = 150;
    levelOne.x = levelTwo.width / 2 + levelOne.width / 6; //Todo:Check logic for centre of genericPostit
    levelOne.y = levelTwo.y - 200;
    viewport.addChild(levelOne, levelTwo);
    console.log(viewport);
    return () => {
      app.stop();
      // On unload completely destroy the application and all of it's children
      app.destroy(true, { children: true });
    };
  }, [props.data]);

  return (
    <div
      style={props.style}
      // style={{
      //   display: "flex",
      //   flex: 1,
      //   backgroundColor: "blue",
      // }}
      ref={ref}
    />
  );
}
