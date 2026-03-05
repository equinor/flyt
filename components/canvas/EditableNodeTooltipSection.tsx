import { NodeDataCommon } from "@/types/NodeData";
import { ChangeEvent } from "react";
import { DurationComponent } from "../DurationComponent";
import { useNodeUpdate } from "./hooks/useNodeUpdate";
import { NodeInput } from "./NodeInput";
import styles from "./NodeTooltipSection.module.scss";
import { FormatNodeText } from "./utils/FormatNodeText";
import dynamic from "next/dynamic";
import { useYjsText } from "@/hooks/useYjsText";

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
  const { values, onChange } = useYjsText(nodeData);

  const shouldDisplayHeader = !(
    isEditing &&
    (variant === "duration" || variant === "description")
  );

  const renderInput = () => {
    switch (variant) {
      case "duration":
        return (
          <DurationComponent
            durationValue={values.duration}
            unitValue={values.unit}
            onChangeDuration={(text) => onChange(text, "duration")}
            onChangeUnit={(text) => onChange(text, "unit")}
            disabled={!nodeData.userCanEdit}
          />
        );
      case "role":
        return (
          <NodeInput
            initialValue={values?.role}
            id={`${nodeData.id}-role`}
            disabled={!nodeData.userCanEdit}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value, "role")
            }
          />
        );
      case "description":
        return (
          <MarkdownEditor
            canEdit={nodeData.userCanEdit}
            defaultText={values?.description || ""}
            label={"Description"}
            onChange={(text) => onChange(text, "description")}
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
