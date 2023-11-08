import { Button } from "@equinor/eds-core-react";
import { SectionQueryValue } from "./hooks/useCanvasTutorial";
import { tokens } from "@equinor/eds-tokens";
import { useCurrentSection } from "./hooks/useCurrentSection";

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
              backgroundColor:
                tokens.colors.interactive.primary__selected_highlight.hex,
            }
          : undefined
      }
    >
      {title}
    </Button>
  );
};
