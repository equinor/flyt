import { Typography, TypographyProps } from "@equinor/eds-core-react";
import styles from "../Node.module.scss";

export function FormatNodeText({
  children,
  ...typographyProps
}: TypographyProps) {
  if (!children) return null;
  const text = children.toString();
  // Pattern matching for Markdown hyperlink urls
  const pattern = /\[([^\]]+)]\(([^)]+)\)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;

  text.replace(pattern, (match, linkText, _, offset) => {
    if (lastIndex <= offset) {
      result.push(
        <span key={`text-${keyIndex++}`}>{text.slice(lastIndex, offset)}</span>
      );
    }

    result.push(
      <Typography
        key={`link-${keyIndex++}`}
        className={styles[typographyProps.className ?? ""]}
        style={{ cursor: "grab" }}
        link
      >
        {linkText}
      </Typography>
    );
    lastIndex = offset + match.length;
    return linkText;
  });

  if (lastIndex < text.length) {
    result.push(
      <span key={`text-${keyIndex++}`}>{text.slice(lastIndex)}</span>
    );
  }

  return <Typography {...typographyProps}>{result}</Typography>;
}
