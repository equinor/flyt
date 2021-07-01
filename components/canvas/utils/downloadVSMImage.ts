import { recursiveTree } from "./recursiveTree";
import { vsmProject } from "../../../interfaces/VsmProject";
import { AbstractRenderer, Renderer } from "@pixi/core";
import { Container } from "@pixi/display";
import { getApp } from "./PixiApp";

export function download_sprite_as_png(
  renderer: Renderer | AbstractRenderer,
  container: Container,
  fileName: string
): void {
  // https://www.html5gamedevs.com/topic/31190-saving-pixi-content-to-image/
  renderer.plugins.extract.canvas(container).toBlob(function (b) {
    const a = document.createElement("a");
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(b);
    a.click();
    a.remove();
  }, "image/png");
}

//Todo: This works, but cuts off parts of the vsm
export const download_tree_as_png = (
  { name, objects }: vsmProject,
  dispatch
): void => {
  const { renderer, stage } = getApp();
  const tree = recursiveTree(objects[0], 0, true, dispatch, () => {
    //ignore
  });
  // const { width, height } = tree.getBounds();
  // const { renderer } = new Application({
  //   antialias: true,
  //   width,
  //   height
  // });
  const fileName = `${name}.png`;
  download_sprite_as_png(renderer, tree, fileName);
};
