import styles from "./Node.module.scss";
import { Typography } from "@equinor/eds-core-react";
import { formatNodeText } from "./utils/formatNodeText";
import { getNodeTypeName } from "@/utils/getNodeTypeName";
import { NodeTypes } from "@/types/NodeTypes";
import { useState } from "react";
import { NodeTooltip } from "./NodeTooltip";

type NodeDescription = {
  header?: NodeTypes;
  description?: string;
};

export const NodeDescription = ({ header, description }: NodeDescription) => {
  const [hoveringText, setHoveringText] = useState(false);

  return (
    <div className={styles["node__description-container"]}>
      {header && (
        <Typography variant="caption" className={styles["node__header"]}>
          {getNodeTypeName(header)}
        </Typography>
      )}
      {description && (
        <Typography
          variant="caption"
          className={styles["node__description"]}
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
        >
          {formatNodeText(description)}
        </Typography>
      )}
      <NodeTooltip text={description} isVisible={hoveringText} />
    </div>
  );
};
