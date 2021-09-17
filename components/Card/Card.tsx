import moment from "moment";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./Card.module.scss";
import { UserDots } from "../UserDots";
import { vsmProject } from "../../interfaces/VsmProject";
import { favorite_outlined, favorite_filled } from "@equinor/eds-icons";
import { Icon } from "@equinor/eds-core-react";
import { useMutation, useQueryClient } from "react-query";
import { faveProject } from "services/projectApi";

export function VSMCard(props: { vsm: vsmProject }): JSX.Element {
  const { userIdentity: createdBy } = props.vsm.created;
  const [isHighlighted, setIsHighlighted] = useState(false);
  const queryClient = useQueryClient();

  const faveMutation = useMutation(
    (isFavourite: boolean) => faveProject(isFavourite, props.vsm.vsmProjectID),
    { onSettled: () => queryClient.invalidateQueries() }
  );

  return (
    <Link href={`/projects/${props.vsm.vsmProjectID}`}>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div className={styles.vsmTitleContainer}>
            <h1 className={styles.vsmTitle}>
              {props.vsm.name || "Untitled VSM"}
            </h1>
          </div>
          <div
            className={styles.favIconContainer}
            onMouseOver={(e) => {
              e.stopPropagation();
              setIsHighlighted(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsHighlighted(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
              faveMutation.mutate(!props.vsm.isFavorite);
            }}
          >
            {props.vsm.isFavorite ? (
              <Icon color="#ff1243" data={favorite_filled} />
            ) : isHighlighted ? (
              <Icon color="#DADADA" data={favorite_filled} />
            ) : (
              <Icon color="#DADADA" data={favorite_outlined} />
            )}
          </div>
        </div>
        <div>
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
