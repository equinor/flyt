/**
 * Disable zoom with mousewheel + control or command key
 */
export function disableMouseWheelZoom(): void {
  const disableMouseWheel = function (event) {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  };
  document.addEventListener("wheel", disableMouseWheel, {
    passive: false,
  });
  document.addEventListener("keydown", disableMouseWheel, {
    passive: false,
  });
}
