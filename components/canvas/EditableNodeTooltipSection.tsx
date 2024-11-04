import { NodeDataCommon } from "@/types/NodeData";
import { ChangeEvent } from "react";
import { DurationComponent } from "../DurationComponent";
import MarkdownEditor from "../MarkdownEditor";
import { useVSMObjectMutation } from "./hooks/useVSMObjectMutation";
import { NodeInput } from "./NodeInput";
import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";

type EditableNodeTooltipSectionProps = {
  header?: string;
  text?: string;
  isEditing?: boolean;
  variant: "description" | "duration" | "role";
  nodeData: NodeDataCommon;
};

export const EditableNodeTooltipSection = ({
  header,
  text,
  isEditing,
  variant = "description",
  nodeData,
}: EditableNodeTooltipSectionProps) => {
  const { patchDescription, patchDuration, patchRole } =
    useVSMObjectMutation(nodeData);

  const shouldDisplayHeader = !(
    isEditing &&
    (variant === "duration" || variant === "description")
  );

  const renderInput = () => {
    switch (variant) {
      case "duration":
        return (
          <DurationComponent
            selectedNode={nodeData}
            onChangeDuration={({ duration, unit }) =>
              patchDuration(duration, unit)
            }
            disabled={!nodeData.userCanEdit}
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
            disabled={!nodeData.userCanEdit}
          />
        );
      case "description":
        return (
          <MarkdownEditor
            canEdit={nodeData.userCanEdit}
            defaultText={text || ""}
            label={"Description"}
            onChange={(value) => patchDescription(value)}
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
