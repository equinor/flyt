import { Scrim, Button, Typography, Icon } from "@equinor/eds-core-react";
import styles from "./PQIRScrim.module.scss";
import { close as closeIcon } from "@equinor/eds-icons";

type Props = {
  onClose: () => void;
  onSaveThisCard: () => void;
  onSaveAllCards: () => void;
};

export const PQIRScrim = ({
  onClose,
  onSaveThisCard,
  onSaveAllCards,
}: Props) => {
  return (
    <Scrim isDismissable open={true} onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.scrimHeaderWrapper}>
          <Typography className={styles.headerText}>
            This PQIR is linked to multiple cards
          </Typography>
          <div className={styles.closeIconWrapper}>
            <Button
              onClick={onClose}
              variant="ghost_icon"
              className={styles.closeButton}
            >
              <Icon data={closeIcon} title="add" size={24} />
            </Button>
          </div>
        </div>
        <div className={styles.horizontalBox}>
          <div className={styles.horizontalLine} />
        </div>

        <div className={styles.bodyWrapper}>
          <Typography className={styles.scrimBody} variant="body_short">
            Would you like to mark it as solved only for this card , or for all
            associated cards?
          </Typography>

          <div className={styles.buttons}>
            <Button
              onClick={onSaveAllCards}
              variant="ghost"
              className={styles.textButton}
            >
              All Cards
            </Button>
            <Button onClick={onSaveThisCard} variant="contained">
              This Card only
            </Button>
          </div>
        </div>
      </div>
    </Scrim>
  );
};
