import { NodeDataCommon } from "@/types/NodeData";
import { ChangeEvent } from "react";
import { DurationComponent } from "../DurationComponent";
import { useNodeUpdate } from "./hooks/useNodeUpdate";
import { NodeInput } from "./NodeInput";
import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

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
  const { patchDescription, patchDurationRole, setdescription } =
    useNodeUpdate(nodeData);

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
            onChangeDuration={(value) => patchDurationRole(value)}
            disabled={!nodeData.userCanEdit}
          />
        );
      case "role":
        return (
          <NodeInput
            initialValue={text}
            id={`${nodeData.id}-role`}
            disabled={!nodeData.userCanEdit}
            onBlur={(e: ChangeEvent<HTMLInputElement>) =>
              patchDurationRole({ role: e.target.value })
            }
          />
        );
      case "description":
        return (
          <MarkdownEditor
            canEdit={nodeData.userCanEdit}
            defaultText={text || ""}
            label={"Description"}
            onChange={(value) => {
              value ? setdescription(value) : setdescription("");
            }}
            onBlur={patchDescription}
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
