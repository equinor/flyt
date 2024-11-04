import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";

type NodeTooltipSectionProps = {
  header?: string;
  text?: string;
};

export const NodeTooltipSection = ({
  header,
  text,
}: NodeTooltipSectionProps) => {
  return (
    <div className={styles.container}>
      {header && (
        <FormatNodeText variant="meta" color="Gray">
          {header}
        </FormatNodeText>
      )}
      <FormatNodeText variant="body_long">{text}</FormatNodeText>
    </div>
  );
};
