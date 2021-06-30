import moment from "moment";
import React from "react";
import Link from "next/link";
import styles from "./Card.module.scss";
import { UserDots } from "../UserDots";
import { vsmProject } from "../../interfaces/VsmProject";

export function VSMCard(props: { vsm: vsmProject }): JSX.Element {
  const { userIdentity: createdBy } = props.vsm.created;

  return (
    <Link href={`/projects/${props.vsm.vsmProjectID}`}>
      <div className={styles.card}>
        <div className={styles.vsmTitleContainer}>
          <h1 className={styles.vsmTitle}>
            {props.vsm.name || "Untitled VSM"}
          </h1>
        </div>
        <div>
          <hr style={{ opacity: 0.1 }} />
          <div className={styles.bottomSection}>
            {!!props.vsm.lastUpdated && (
              <p className={styles.vsmLabel}>
                Edited {moment(props.vsm.lastUpdated.changeDate).fromNow()}
              </p>
            )}
            {createdBy && (
              <UserDots
                users={[
                  `${createdBy}`,
                  ...props.vsm.userAccesses.map((u) => u.user),
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
