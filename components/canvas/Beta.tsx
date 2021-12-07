import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { io } from "socket.io-client";
import { Viewport } from "pixi-viewport";
import { getAccessToken } from "auth/msalHelpers";
import { addCardsToCanvas } from "./utils/AddCardsToCanvas";
import { getProject } from "services/projectApi";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { loadAssets } from "./utils/LoadAssets";
import { assets } from "./utils/AssetFactory";
import { useAccount, useMsal } from "@azure/msal-react";
import { debounce } from "utils/debounce";

export default function Canvas() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const userName = account.username;

  const ref = useRef<HTMLDivElement>();
  // const [myId, setMyId] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const { data: process, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      //Socket setup
      const socket = io({ path: "/api/socket", auth: { token: accessToken } });
      socket.on("connect", () => {
        console.log("connected", socket.id);
        //   setMyId(socket.id);
      });

      // New pixi canvas with pixi-viewport setup
      const { viewPort, cleanup: pixiCleanup } = PixiSetup(ref);

      // Note that elements added to the viewPort are affected by the zoom and pan
      // while elements added to the app.stage are not.

      // For example, if you want the pointer to stay the same size when you zoom, you add it to the app.stage.
      const pointer = UserPointer();
      viewPort.addChild(pointer);
      pointer.visible = false; // note we are currently not displaying this pointer since we already are displaying the pointer created in AddCardsToCanvas class

      //Add assets
      const cleanupAssets = loadAssets(assets, () => setAssetsAreLoaded(true));
      if (process && assetsAreLoaded) {
        addCardsToCanvas(viewPort, process, true, null, null, null);
      }

      // add it to the viewport
      // viewPort.addChild(pointer);

      let lastPointerEvent = 0;
      // listen for pointer move events
      viewPort.on("pointermove", (event) => {
        //get the pointer position
        const { x, y } = viewPort.toLocal(event.data.global);

        //let's throttle the amount of events we send to the server
        // limit it to once every 100ms
        const now = Date.now();
        if (now - lastPointerEvent > 100) {
          lastPointerEvent = now;
          // socket.emit("pointermove", { x, y, user: userName });
        } else {
          //let's make sure the last position is sent
          debounce(
            () => socket.emit("pointer", { x, y, user: userName }),
            1000,
            "PointerPosition"
          );
        }
      });

      // Pointers
      const pointers: {
        [x: string]: { x: number; y: number; sprite };
      } = {};
      // socket listen for pointer position
      socket.on("pointer", (data: { user: string; x: number; y: number }) => {
        // if (data.user === userName) return;
        console.log(data.user);
        // update the sprite position
        const { x, y } = data;
        if (!pointers[data.user]) {
          const sprite = new PIXI.Graphics();
          const color = Math.floor(Math.random() * 0xffffff);
          sprite.beginFill(color);
          sprite.drawCircle(0, 0, 10);
          sprite.endFill();
          viewPort.addChild(sprite);
          pointers[data.user] = { x, y, sprite };
        } else {
          pointers[data.user].x = x;
          pointers[data.user].y = y;
        }

        //move the sprite
        pointers[data.user].sprite.position.set(x, y);
      });

      // //show pointer when in ViewPort
      // viewPort.on("pointerover", (event: any) => (pointer.visible = true));
      // //hide pointer when not in ViewPort
      // viewPort.on("pointerout", (event: any) => (pointer.visible = false));

      return () => {
        // cleanup
        pixiCleanup();
        cleanupAssets();
        socket.disconnect();
        socket.close();
      };
    });
  }, [process, assetsAreLoaded]);

  return <div ref={ref} />;
}

function UserPointer() {
  const color = Math.floor(Math.random() * 0xffffff);

  const pointer = new PIXI.Graphics();
  pointer.beginFill(color);
  pointer.drawCircle(0, 0, 10);
  pointer.endFill();
  return pointer;
}

function PixiSetup(ref: MutableRefObject<HTMLDivElement>) {
  if (!ref.current) return;
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    resizeTo: window,
    antialias: true,
  });

  //Add canvas to DOM
  ref.current.replaceChildren(app.view);

  // add a pixi-viewport to the canvas
  const viewPort = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });

  // add the viewport to the stage
  app.stage.addChild(viewPort);

  // activate plugins
  viewPort.drag().pinch().wheel().decelerate();

  ///Resize handler
  // Listen for window resize events
  window.addEventListener("resize", () => {
    // Resize the pixi app's renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Resize the pixi viewport
    viewPort.resize(
      window.innerWidth,
      window.innerHeight,
      viewPort.worldWidth,
      viewPort.worldHeight
    );
  });
  const cleanup = () => {
    window.removeEventListener("resize", () => {
      //Purposely left blank
    });
    app.stage.removeChild(viewPort);
    ref.current.removeChild(app.view);
    viewPort.destroy();
    app.destroy();
  };
  return { app, viewPort, cleanup };
}
