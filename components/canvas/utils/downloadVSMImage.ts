import { vsmProject } from "../../../interfaces/VsmProject";
import { AbstractRenderer, Renderer } from "@pixi/core";
import { Container } from "@pixi/display";
import { Application } from "pixi.js";

export function download_sprite_as_png(
  renderer: Renderer | AbstractRenderer,
  container: Container,
  fileName: string
): void {
  console.log({ renderer, container });
  // https://www.html5gamedevs.com/topic/31190-saving-pixi-content-to-image/
  renderer.plugins.extract.canvas(container).toBlob((b) => {
    const a = document.createElement("a");
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(b);
    a.click();
    a.remove();
  }, "image/png");
}

// Todo: Improve resolution
export const download_tree_as_png = (
  { name, vsmProjectID }: vsmProject,
  tree: Container
): void => {
  const { renderer } = new Application({
    antialias: true,
    resolution: 4, //Doesn't seem to help...
  });
  //Set X & Y coords so that it fits in our virtual view
  tree.y = 0;
  tree.x = -31;
  //Alternatively; scale it up or down
  const scale = 1;
  tree.scale.x = scale;
  tree.scale.y = scale;

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fileName = `Flyt canvas (${vsmProjectID}) - ${name} - ${date}.png`;
  //download_sprite_as_png(renderer, tree, fileName);
};
