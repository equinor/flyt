import { NodeData } from "@/types/NodeData";
import { useVSMObjectMutation } from "./hooks/useVSMObjectMutation";
import { NodeInput } from "./NodeInput";
import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";
import { DurationComponent } from "../DurationComponent";
import { ChangeEvent } from "react";

type NodeTooltipSectionProps = {
  header?: string;
  text?: string;
  isEditing?: boolean;
  variant: "description" | "duration" | "role";
  nodeData: NodeData;
};

export const NodeTooltipSection = ({
  header,
  text,
  isEditing,
  variant = "description",
  nodeData,
}: NodeTooltipSectionProps) => {
  const { patchDescription, patchDuration, patchRole } =
    useVSMObjectMutation(nodeData);

  const shouldDisplayHeader = !(isEditing && variant === "duration");

  const renderInput = () => {
    switch (variant) {
      case "duration":
        return (
          <DurationComponent
            selectedNode={nodeData}
            onChangeDuration={({ duration, unit }) =>
              patchDuration(duration, unit)
            }
            disabled={false}
          />
        );
      case "role":
        return (
          <NodeInput
            initialValue={text}
            id={`${nodeData.id}-role`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              patchRole(e.target.value)
            }
          />
        );
      case "description":
        return (
          <NodeInput
            initialValue={text}
            id={`${nodeData.id}-description`}
            multiline
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              patchDescription(e.target.value)
            }
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      {shouldDisplayHeader && (
        <FormatNodeText variant="meta" color="Gray">
          {header}
        </FormatNodeText>
      )}
      {isEditing ? (
        renderInput()
      ) : (
        <FormatNodeText variant="body_long">{text}</FormatNodeText>
      )}
    </div>
  );
};
