import { NodeDataCommon } from "@/types/NodeData";
import { ChangeEvent } from "react";
import { DurationComponent } from "../DurationComponent";
import { useNodeUpdate } from "./hooks/useNodeUpdate";
import { NodeInput } from "./NodeInput";
import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";
import dynamic from "next/dynamic";
import { Description, Duration, Role } from "@/types/NodeInput";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});
type EditableNodeTooltipSectionProps = {
  header?: string;
  text?: string;
  isEditing?: boolean;
  isCardEditablebyUser?: boolean;
  variant: "description" | "duration" | "role";
  nodeData: NodeDataCommon;
};
export const EditableNodeTooltipSection = ({
  header,
  text,
  isEditing,
  variant = Description,
  nodeData,
  isCardEditablebyUser,
}: EditableNodeTooltipSectionProps) => {
  const { patchNode, handleInputChange, lastSentValues } =
    useNodeUpdate(nodeData);

  const shouldDisplayHeader = !(
    isEditing &&
    (variant === Duration || variant === Description)
  );

  const renderInput = () => {
    switch (variant) {
      case Duration:
        return (
          <DurationComponent
            selectedNode={nodeData}
            onChangeDuration={(value, field) => handleInputChange(value, field)}
            disabled={!nodeData.userCanEdit}
            lastUpdatedDuration={lastSentValues?.duration || 0}
            lastUpdatedUnit={lastSentValues?.unit || ""}
          />
        );
      case Role:
        return (
          <NodeInput
            initialValue={text}
            id={`${nodeData.id}-role`}
            disabled={!nodeData.userCanEdit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputChange(e.target.value, Role);
            }}
            lastUpdatedValue={lastSentValues?.role || ""}
          />
        );
      case Description:
        return (
          <MarkdownEditor
            canEdit={nodeData.userCanEdit}
            defaultText={text || ""}
            label={"Description"}
            onChange={(value) => {
              handleInputChange(value, Description);
            }}
            lastUpdatedValue={lastSentValues?.description || ""}
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
      {isEditing && isCardEditablebyUser ? (
        renderInput()
      ) : (
        <FormatNodeText variant="body_long">{text}</FormatNodeText>
      )}
    </div>
  );
};
