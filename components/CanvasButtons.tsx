import { CategorizationPageButton } from "./CategorizationPageButton";
import styles from "./CanvasButtons.module.scss";
import { ManageLabelsButton } from "./Labels/ManageLabelsButton";
import { CanvasTutorial } from "@/components/canvas/CanvasTutorial/CanvasTutorial";
import { ProcessHierarchyButton } from "./canvas/ProcessHierarchy/ProcessHierarchyButton";

type CanvasButtonsProps = {
  handleClickLabel: () => void;
  userCanEdit: boolean;
};

export const CanvasButtons = ({
  handleClickLabel,
  userCanEdit,
}: CanvasButtonsProps) => (
  <div className={styles.container}>
    <ProcessHierarchyButton />
    {userCanEdit && <ManageLabelsButton handleClickLabel={handleClickLabel} />}
    <CategorizationPageButton />
    <CanvasTutorial />
  </div>
);
