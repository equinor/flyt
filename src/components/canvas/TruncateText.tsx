export function truncateText(text: string | null, maxLength = 120): string {
  if (!text) return "";
  if (text.length > maxLength) {
    return `${text?.trim().slice(0, maxLength)}...`;
  } else return text;
}
