export function formatCanvasText(text: string | null, maxLength = 100): string {
  if (!text) return "";
  let formattedText = text;
  if (text.length > maxLength) {
    formattedText = `${text?.slice(0, maxLength)}...`;
  }
  return formattedText.replace(/(\r\n|\n|\r)/gm, " ");
}
