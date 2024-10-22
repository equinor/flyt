import { Button, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import styles from "./AddQIPRButton.module.scss";

export const AddQIPRButton = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.container}>
    <Button
      variant="ghost_icon"
      onClick={onClick}
      style={{ width: 33, height: 33 }}
    >
      <Icon data={add} />
    </Button>
  </div>
);
