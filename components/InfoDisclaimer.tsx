import React, { useEffect, useState } from "react";
import { Button, Typography, Scrim, Checkbox } from "@equinor/eds-core-react";
import useLocalStorage from "../hooks/useLocalStorage";
import styles from "./InfoDisclaimer.module.scss";

export const InfoDisclaimer = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useLocalStorage(
    "infoDisclaimer",
    false
  );

  useEffect(() => {
    if (!dontShowAgain) {
      setOpen(true);
    }
  }, [dontShowAgain]);

  const handleClose = () => {
    if (dontShowAgain) {
      setDontShowAgain(true);
    }
    setOpen(false);
  };

  return (
    <Scrim open={open} onWheel={(e) => e.stopPropagation()}>
      <div className={styles.scrimWrapper}>
        <div className={styles.scrimContent}>
          <Typography color="#000000" variant={"h1"}>
            Welcome to Flyt
          </Typography>
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>
              Content in Flyt is open to all Equinor employees.
              <br />
              Do not share personal, sensitive, or confidential information.
            </p>
          </div>
          <Button variant={"contained"} color={"primary"} onClick={handleClose}>
            Continue
          </Button>
          <div className={styles.checkboxRow}>
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span className={styles.checkboxText}>
              Do not show this message again
            </span>
          </div>
        </div>
      </div>
    </Scrim>
  );
};

export default InfoDisclaimer;
