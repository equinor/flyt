import * as React from "react";
import * as PIXI from "pixi.js";
import { DisplayObject } from "pixi.js";

export class Rabbits extends React.Component {
  app = new PIXI.Application({ resizeTo: window });
  canvas: HTMLDivElement | null = null;
  private data: any;
  private alpha = 1;
  private dragging = false;
  private x = 0;
  private y = 0;
  private parent: PIXI.DisplayObject = new DisplayObject();

  componentDidMount(): void {
    this.canvas?.appendChild(this.app.view);
    this.addBunny();
  }

  componentWillUnmount(): void {
    this.app.stop();
    //Todo: Save the PIXI.Container here if we want to persist it when unmounting
  }

  createBunny(x: number, y: number): void {
    const texture = PIXI.Texture.from(
      "https://pixijs.io/examples/examples/assets/bunny.png"
    );
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    const bunny = new PIXI.Sprite(texture);
    bunny.interactive = true;
    bunny.buttonMode = true;
    bunny.anchor.set(0.5);
    bunny.scale.set(3);
    bunny
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);
    bunny.x = x;
    bunny.y = y;
    this.app.stage.addChild(bunny);
  }

  onDragStart(event: { data: unknown }): void {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd(): void {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  onDragMove(): void {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

  addBunny(): void {
    for (let i = 0; i < 10; i++) {
      this.createBunny(
        Math.floor(Math.random() * this.app.screen.width),
        Math.floor(Math.random() * this.app.screen.height)
      );
    }
  }

  render(): JSX.Element {
    return <div ref={(thisDiv) => (this.canvas = thisDiv)} />;
  }
}
