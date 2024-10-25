import { ButtonWrapper } from "@/components/ButtonWrapper";
import { tag_relations } from "@equinor/eds-icons";

type ProcessHierarchyButtonProps = {
  onClick: () => void;
};

export const ProcessHierarchyButton = ({
  onClick,
}: ProcessHierarchyButtonProps) => {
  return (
    <ButtonWrapper
      icon={tag_relations}
      onClick={onClick}
      title={"Process Hierarchy"}
    />
  );
};
