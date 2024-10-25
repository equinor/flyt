import styles from "./Node.module.scss";
import { Typography } from "@equinor/eds-core-react";
import { FormatNodeText } from "./utils/FormatNodeText";

type NodeDescription = {
  header?: string;
  description?: string;
  helperText?: string;
};

export const NodeDescription = ({
  header,
  description,
  helperText,
}: NodeDescription) => (
  <div className={styles["node__description-container"]}>
    {header && (
      <Typography
        variant="caption"
        className={
          helperText && !description
            ? styles["node__description"]
            : styles["node__placeholder-text"]
        }
      >
        {header}
      </Typography>
    )}
    {description ? (
      <FormatNodeText variant="caption" className={styles["node__description"]}>
        {description}
      </FormatNodeText>
    ) : (
      helperText && (
        <FormatNodeText
          lines={7}
          variant="meta"
          className={styles["node__helper-text"]}
        >
          {helperText}
        </FormatNodeText>
      )
    )}
  </div>
);
