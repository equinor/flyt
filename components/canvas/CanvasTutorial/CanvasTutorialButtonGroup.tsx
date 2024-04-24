import {
  CanvasTutorialSectionButton,
  CanvasTutorialSectionButtonProps,
} from "./CanvasTutorialSectionButton";
import styles from "./CanvasTutorialButtonGroup.module.scss";
import { SectionQueryValue } from "./hooks/useCanvasTutorial";

const buttons: Omit<CanvasTutorialSectionButtonProps, "onClick">[] = [
  { section: "add-new-main-activity", title: "Main Activity" },
  { section: "add-new-sub-activity", title: "Sub Activity" },
  { section: "add-new-wait", title: "Wait" },
  { section: "add-new-choice", title: "Choice" },
  { section: "merge-activities", title: "Merge" },
];

type CanvasTutorialButtonGroupProps = {
  onSectionButtonClick: (section: SectionQueryValue) => void;
};

export const CanvasTutorialButtonGroup = ({
  onSectionButtonClick,
}: CanvasTutorialButtonGroupProps) => (
  <div className={styles.container}>
    {buttons.map((props) => (
      <CanvasTutorialSectionButton
        key={props.section}
        {...props}
        onClick={() => onSectionButtonClick(props.section)}
      />
    ))}
  </div>
);
