import styles from "../pages/process/[id]/categories/categories.module.scss";
import { Button, Icon } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import { MouseEventHandler, ReactNode } from "react";

export function InfoBox(props: {
  children: ReactNode;
  onClose: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className={styles.infoBox}>
      <div>{props.children}</div>
      <div className={styles.closeIcon}>
        <Button variant={"ghost_icon"} onClick={props.onClose}>
          <Icon style={{ color: "#DEE5E7" }} data={close} />
        </Button>
      </div>
    </div>
  );
}
