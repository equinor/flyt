import { Typography, TypographyProps } from "@equinor/eds-core-react";
import ReactMarkdown from "react-markdown";

export type TypographyMarkdownProps = Omit<TypographyProps, "children"> & {
  children?: string;
};

/**
 * When you want to render markdown in a Typography component.
 * `children` has to be a string (or undefined).
 */
export const TypographyMarkdown = ({
  children,
  ...rest
}: TypographyMarkdownProps) => {
  return (
    <Typography {...rest}>
      <ReactMarkdown>{children ?? ""}</ReactMarkdown>
    </Typography>
  );
};
