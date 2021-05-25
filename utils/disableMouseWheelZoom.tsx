/**
 * Disable zoom with mousewheel + control or command key
 */
export function disableMouseWheelZoom(): void {
  document.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    },
    {
      passive: false,
    }
  );
}
