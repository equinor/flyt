import styles from "./TextCircle.module.scss";

type TextCircleProps = {
  text: string;
  color: string;
};

export const TextCircle = ({ text, color }: TextCircleProps) => (
  <div
    className={styles.container}
    style={{
      background: color,
    }}
  >
    {text}
  </div>
);
