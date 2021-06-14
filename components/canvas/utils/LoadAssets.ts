import * as PIXI from "pixi.js";
import { clearSprites } from "./AssetFactory";

/**
 * Load assets into shared Pixi loader
 * @param assets
 * @param onComplete
 *
 * @return cleanupMethod
 */
export function loadAssets(
  assets: { [s: string]: unknown } | ArrayLike<unknown>,
  onComplete: { (): void; (): unknown }
): () => void {
  const loader = PIXI.Loader.shared;
  Object.entries(assets).forEach((asset) => {
    const [key, value] = asset;
    // Only add it if it's not already loaded. (using the shared loader)
    if (!loader.resources[key]) {
      loader.add(key, value);
    }
  });

  // loader.onLoad.add((value) => {} );
  // loader.onError.add((value) => {} );
  // loader.onProgress.add(() => {});
  // loader.onComplete.add(() => {});
  loader.load(() => onComplete());
  return () => {
    //Removing assets
    clearSprites();
    loader.destroy();
  };
}
