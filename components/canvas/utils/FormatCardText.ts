export function formatCardText(
  text: string | null,
  maxLength = 100,
  removeNewLines = false
): string {
  if (!text) return "";
  let formattedText = text.replace(
    /(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
    "$2"
  );
  if (formattedText.length > maxLength) {
    formattedText = `${formattedText?.slice(0, maxLength)}...`;
  }
  if (removeNewLines) return formattedText.replace(/(\r\n|\n|\r)/gm, " ");
  return formattedText;
}
