import * as PIXI from "pixi.js";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import { Viewport } from "pixi-viewport";
import { addCardsToCanvas } from "./utils/AddCardsToCanvas";
import { assets } from "./utils/AssetFactory";
import { getAccessToken } from "auth/msalHelpers";
import { getProject } from "services/projectApi";
import { io } from "socket.io-client";
import { loadAssets } from "./utils/LoadAssets";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { unknownErrorToString } from "../../utils/isError";
import { GraphNode } from "../../utils/layoutEngine";
import { ErrorMessage } from "../errorMessage";
import { Loading } from "../loading";

export default function Canvas(props: { onSelectCard: (id: number) => void }) {
  const ref = useRef<HTMLDivElement>();
  const router = useRouter();
  const { id } = router.query;

  const {
    data: process,
    error,
    isLoading,
  } = useQuery(["project", id], () => getProject(id), {
    enabled: !!id,
  });
  const [assetsAreLoaded, setAssetsAreLoaded] = useState(false);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      //Socket setup
      const socket = io({ path: "/api/socket", auth: { token: accessToken } });
      socket.on("connect", () => {
        console.log("connected", socket.id);
      });

      // New pixi canvas with pixi-viewport setup
      const { viewPort, cleanup: pixiCleanup, app } = PixiSetup(ref);

      //Add assets
      const cleanupAssets = loadAssets(assets, () => setAssetsAreLoaded(true));
      if (process && assetsAreLoaded) {
        addCardsToCanvas(
          viewPort,
          process,
          true,
          null,
          (node: GraphNode | null | undefined) => props.onSelectCard(node?.id),
          null,
          app
        );
      }

      return () => {
        // cleanup
        pixiCleanup();
        cleanupAssets();
        socket.disconnect();
        socket.close();
      };
    });
  }, [process, assetsAreLoaded]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <ErrorMessage error={error} />
      <div ref={ref} />
    </>
  );
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
  const resizeEvent = () => {
    // set the screen size of the viewport
    viewPort.resize(
      window.innerWidth,
      window.innerHeight,
      viewPort.worldWidth,
      viewPort.worldHeight
    );
  };

  // Listen for window resize events
  window.addEventListener("resize", resizeEvent);
  const cleanup = () => {
    window.removeEventListener("resize", resizeEvent);
    app.stage.removeChild(viewPort);
    ref.current.removeChild(app.view);
    viewPort.destroy();
    app.destroy();
  };
  return { app, viewPort, cleanup };
}
