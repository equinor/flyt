import { Scrim, Button, Typography, Icon } from "@equinor/eds-core-react";
import styles from "./PQIRScrim.module.scss";

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
          <div className={styles.headerText}>
            <Typography variant="h6" className={styles.headerText}>
              This PQIR is linked to multiple cards
            </Typography>
          </div>
          <Button
            onClick={onClose}
            style={{ backgroundColor: "white", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="#007079"
              />
            </svg>
          </Button>
        </div>

        <div className={styles.horizontalLine} />
        <div className={styles.bodyWrapper}>
          <div>
            <Typography className={styles.scrimBody} variant="body_short">
              Would you like to mark it as solved only for this card or for all
              associated cards?
            </Typography>
          </div>
          <div className={styles.buttons}>
            <Button onClick={onSaveAllCards} variant="outlined">
              All Cards
            </Button>
            <Button onClick={onSaveThisCard} variant="outlined">
              This Card only
            </Button>
          </div>
        </div>
      </div>
    </Scrim>
  );
};
