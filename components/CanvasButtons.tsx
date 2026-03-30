import { CategorizationPageButton } from "./CategorizationPageButton";
import styles from "./CanvasButtons.module.scss";
import { ManageLabelsButton } from "./Labels/ManageLabelsButton";
import { CanvasTutorial } from "@/components/canvas/CanvasTutorial/CanvasTutorial";
import { LinkedProcessesButton } from "./canvas/LinkedProcesses/LinkedProcessesButton";
import { UndoRedoButton } from "@/components/canvas/UndoRedo/UndoRedoButton";

type CanvasButtonsProps = {
  handleClickLabel: () => void;
  userCanEdit: boolean;
};

export const CanvasButtons = ({
  handleClickLabel,
  userCanEdit,
}: CanvasButtonsProps) => (
  <div className={styles.container}>
    <UndoRedoButton />
    <LinkedProcessesButton />
    {userCanEdit && <ManageLabelsButton handleClickLabel={handleClickLabel} />}
    <CategorizationPageButton />
    <CanvasTutorial />
  </div>
);
