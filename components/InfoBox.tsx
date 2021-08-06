import React, { useState } from "react";
import styles from "../pages/projects/[id]/categories/categories.module.scss";
import { Button, Icon } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";

export function InfoBox(): JSX.Element {
  const [showInfobox, setShowInfobox] = useState(true);
  if (showInfobox)
    return (
      <div className={styles.infoBox}>
        <div>
          <p>
            Drag a category into one or more of the problems, ideas or
            questions.
          </p>

          <div className={styles.closeIcon}>
            <Button
              variant={"ghost_icon"}
              onClick={() => setShowInfobox(false)}
            >
              <Icon style={{ color: "#DEE5E7" }} data={close} />
            </Button>
          </div>
        </div>
      </div>
    );
  return <></>;
}
