import { Button } from "@equinor/eds-core-react";
import { SectionQueryValue } from "./hooks/useCanvasTutorial";
import { useCurrentSection } from "./hooks/useCurrentSection";
import { colors } from "theme/colors";

export type CanvasTutorialSectionButtonProps = {
  section: SectionQueryValue;
  title: string;
  onClick: () => void;
};

export const CanvasTutorialSectionButton = ({
  section,
  title,
  onClick,
}: CanvasTutorialSectionButtonProps) => {
  const { isCurrentSection } = useCurrentSection(section);

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      style={
        isCurrentSection
          ? {
              backgroundColor: colors.interactive_primary__selected_highlight,
            }
          : undefined
      }
    >
      {title}
    </Button>
  );
};
