import * as PIXI from "pixi.js";

/**
 * Return a grid of the PIXI.Container items
 * @param items
 * @param breakAt
 * @param spaceBetween
 */
export function createGrid(
  items: PIXI.Container[],
  breakAt = 4,
  spaceBetween = 4
): PIXI.Container {
  const container = new PIXI.Container();
  let lastItem;
  items?.forEach((item: PIXI.DisplayObject, i) => {
    // GRID LAYOUT. Default breaking at 4 items in height.

    const topItem = i !== 0 && i % breakAt === 0;
    const firstItem = !lastItem;

    if (firstItem) {
      // Put it top left
      item.y = spaceBetween; // Row
      item.x = spaceBetween; // Column
    } else {
      if (topItem) {
        // We have a new column (x)
        // Put it on the top and move it right so it doesn't go over the last item
        item.y = spaceBetween;
        item.x = lastItem.x + lastItem.width + spaceBetween;
      } else {
        // Move it down a row (y). Keep the column (x) placement
        item.y = lastItem.y + lastItem.height + spaceBetween;
        item.x = lastItem.x;
      }
    }
    container.addChild(item);
    lastItem = item;
  });
  return container;
}
