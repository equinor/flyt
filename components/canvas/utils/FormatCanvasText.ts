export function formatCanvasText(
  text: string | null,
  maxLength = 100,
  removeNewLines = false
): string {
  if (!text) return "";
  let formattedText = text;
  if (text.length > maxLength) {
    formattedText = `${text?.slice(0, maxLength)}...`;
  }
  if (removeNewLines) return formattedText.replace(/(\r\n|\n|\r)/gm, " ");
  return formattedText;
}
