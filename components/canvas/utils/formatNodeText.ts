export const formatNodeText = (text: string | null): string => {
  if (!text) return "";
  // Removes hyperlink urls
  return text.replace(
    /(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
    "$2"
  );
};
