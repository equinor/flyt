import styles from "./Node.module.scss";
import { Typography } from "@equinor/eds-core-react";
import { FormatNodeText } from "./utils/FormatNodeText";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { NodeTypes } from "@/types/NodeTypes";

type NodeDescription = {
  header?: NodeTypes;
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
            ? undefined
            : styles["node__placeholder-text"]
        }
      >
        {getNodeTypeName(header)}
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
