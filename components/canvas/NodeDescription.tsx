import styles from "./Node.module.scss";
import { Typography } from "@equinor/eds-core-react";
import { FormatNodeText } from "./utils/FormatNodeText";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { NodeTypes } from "@/types/NodeTypes";

type NodeDescription = {
  header?: NodeTypes;
  description?: string;
};

export const NodeDescription = ({ header, description }: NodeDescription) => {
  return (
    <div className={styles["node__description-container"]}>
      {header && (
        <Typography variant="caption" className={styles["node__header"]}>
          {getNodeTypeName(header)}
        </Typography>
      )}
      {description && (
        <FormatNodeText
          variant="caption"
          className={styles["node__description"]}
        >
          {description}
        </FormatNodeText>
      )}
    </div>
  );
};
