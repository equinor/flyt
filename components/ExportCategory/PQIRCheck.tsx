import React from "react";
import styles from "./PQIRCheck.module.scss";
import { Checkbox, Typography } from "@equinor/eds-core-react";

type PQIRCheck = {
  isChecked: boolean;
  setIsChecked: (isChecked: (p: boolean) => boolean) => void;
  label: string;
  noOfCategories: number;
};

export function PQIRCheck({
  isChecked,
  setIsChecked,
  label,
  noOfCategories,
}: PQIRCheck) {
  const handleSelectPQIR = () => {
    if (!noOfCategories) return;
    setIsChecked((p) => !p);
  };
  return (
    <div className={styles.pqirBox} onClick={handleSelectPQIR}>
      <Checkbox
        checked={isChecked}
        onChange={() => null}
        disabled={noOfCategories ? false : true}
      />
      <Typography>{label}</Typography>
      <Typography className={styles.categoryText}>
        ({noOfCategories} category’s)
      </Typography>
    </div>
  );
}
