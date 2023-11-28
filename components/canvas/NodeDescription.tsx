import { formatNodeText } from "./utils/formatNodeText";
import styles from "./Node.module.scss";
import { NodeTypes } from "types/NodeTypes";
import { Typography } from "@equinor/eds-core-react";
import { getNodeTypeName } from "utils/getNodeTypeName";

type NodeDescription = {
  type: NodeTypes;
  description?: string;
};

export const NodeDescription = ({ description, type }: NodeDescription) => (
  <div className={styles["node__description-container"]}>
    <Typography
      variant="caption"
      className={`${styles.description} ${
        !description && styles["description--placeholder"]
      }`}
    >
      {formatNodeText(description ? description : getNodeTypeName(type))}
    </Typography>
  </div>
);
