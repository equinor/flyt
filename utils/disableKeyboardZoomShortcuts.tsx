/**
 * Disable zoom with keyboard
 */
export function disableKeyboardZoomShortcuts(): void {
  document.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) && // Windows (ctrl) || Mac (command/meta)
      (event.which == 48 || // 0
        event.which == 61 || // Plus key  +/=
        event.which == 107 || // Num Key  +
        event.which == 173 || // Min Key  hyphen/underscore key
        event.which == 109 || // Num Key  -
        event.which == 187 || // Windows 2000: For any country/region, the '+' key
        event.which == 189) // Windows 2000: For any country/region, the '-' key
    ) {
      event.preventDefault();
    }
  });
}
