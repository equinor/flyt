/**
 * Disable default undo redo behaviour with keyboard
 */
export function disableKeyboardUndoRedoShortcuts(): void {
  document.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey && e.key.toLowerCase() === "z") || // Undo
      (e.ctrlKey && e.key.toLowerCase() === "y") || // Redo
      (e.metaKey && e.key.toLowerCase() === "z") // Mac Undo/Redo
    ) {
      e.preventDefault();
    }
  });
}
