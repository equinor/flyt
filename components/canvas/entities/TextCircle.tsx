import { Typography } from "@equinor/eds-core-react";
import styles from "./TextCircle.module.scss";

type TextCircleProps = {
  color: string;
  text: string;
};

export const TextCircle = ({ color, text }: TextCircleProps) => (
  <div
    className={styles.container}
    style={{
      backgroundColor: color,
    }}
  >
    <Typography variant="body_short" color="white">
      {text}
    </Typography>
  </div>
);
