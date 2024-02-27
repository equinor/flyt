import Link from "next/link";
import styles from "./OldFlytButton.module.scss";
import { Button } from "@equinor/eds-core-react";

export const OldFlytButton = ({ projectId }) => {
  return (
    <Link
      href={`https://web-flyt-old.radix.equinor.com/process/${projectId}`}
      target="_blank"
    >
      <Button className={styles.oldFlytButtonContainer} variant="ghost">
        See this process in Flyt 1.0
      </Button>
    </Link>
  );
};
