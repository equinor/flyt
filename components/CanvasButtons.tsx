import { CategorizationPageButton } from "./CategorizationPageButton";
import styles from "./CanvasButtons.module.scss";
import { ManageLabelsButton } from "./Labels/ManageLabelsButton";

type CanvasButtonsProps = {
  handleClickLabel: () => void;
  userCanEdit: boolean;
};

export const CanvasButtons = ({
  handleClickLabel,
  userCanEdit,
}: CanvasButtonsProps) => (
  <div className={styles.container}>
    {userCanEdit && <ManageLabelsButton handleClickLabel={handleClickLabel} />}
    <CategorizationPageButton />
  </div>
);
