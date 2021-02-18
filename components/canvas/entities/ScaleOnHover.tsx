import PIXI from "pixi.js";

export function ScaleOnHover(container: PIXI.Container) {
  console.log(container.width, container.height);
  // Make sure it scales from the center
  container.pivot.set(container.width / 2, container.height / 2);
  container.x = container.x + container.width / 2;
  container.y = container.y + container.height / 2;

  container.interactive = true;

  // Values for the scaling
  const targetScale = 1.1;
  const initialScale = 1;
  let currentScale = initialScale;

  let timer: NodeJS.Timeout;
  const delta = 0.01; // Change in scale per X ms
  const ms = 10;

  // Scale up
  container.on("mouseover", () => {
    if (timer) clearTimeout(timer);
    timer = setInterval(() => {
      if (currentScale + delta <= targetScale) {
        container?.scale.set((currentScale += delta));
      } else {
        clearTimeout(timer);
        container?.scale.set(targetScale);
        currentScale = targetScale;
      }
    }, ms);
  });

  // Scale down
  container.on("mouseout", () => {
    if (timer) clearTimeout(timer);
    timer = setInterval(() => {
      if (currentScale + delta > initialScale) {
        container?.scale.set((currentScale -= delta));
      } else {
        clearTimeout(timer);
        container?.scale.set(initialScale);
        currentScale = initialScale;
      }
    }, ms);
  });
}
