import Link from "next/link";
import React from "react";

// Todo: generalize to allow for other markdown syntax.
export function marked(incoming: string): JSX.Element[] {
  const expressions = {
    link: /\[([^\]]+)\]\(([^\)]+)\)/g, // [text](url)
  };

  const lines = incoming.split("\n");
  const result: JSX.Element[] = [];
  const unorderedList: {
    element: JSX.Element;
    position: { lineNumber: number; start: number; end: number };
  }[] = [];

  // const line = incoming;
  lines.forEach((line, lineNumber) => {
    // check for links, then split the line into parts
    const linkMatch = line.match(expressions.link);

    // const parts =
    linkMatch?.forEach((match) => {
      // split the match into parts
      const [, text, url] = match.match(/\[([^\]]+)\]\(([^\)]+)\)/) || [];
      const linkElement = <Link href={url}>{text}</Link>;
      const position = {
        lineNumber,
        start: line.indexOf(match),
        end: line.indexOf(match) + match.length,
      };
      unorderedList.push({ element: linkElement, position });
      return { text, url, position };
    });
  });

  // split the line into parts based on the matches start and end positions
  // then add the parts to the result
  const parts = [];
  let lastPosition = 0;
  lines.forEach((line) => {
    unorderedList.forEach((item) => {
      const { start, end } = item.position;
      // if (start > lastPosition) {
      const text = line.substring(lastPosition, start);
      if (text) {
        if (text.trim()) {
          // if the text is not empty
          parts.push(<p>{text}</p>); // add the text
        } else {
          parts.push(<p> </p>); // add a space
        }
      }
      // }
      parts.push(item.element);
      lastPosition = end;
    });

    result.push(...parts);

    // Add any remaining text
    if (lastPosition < line.length) {
      result.push(<p>{line.substring(lastPosition)}</p>);
    }
    result.push(<br />); // Every line should end with a newline
  });

  return result;
}
