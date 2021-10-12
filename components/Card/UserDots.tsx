import { Tooltip } from "@equinor/eds-core-react";
import React from "react";
import { UserDot } from "../UserDot";
import styles from "./UserDots.module.scss";

export function UserDots(props: {
  users: Array<string>;
  setVisibleScrim: (any: boolean) => void;
}): JSX.Element {
  const { users, setVisibleScrim } = props;
  const shownUsers = users.length > 3 ? users.slice(0, 3) : users;
  const numberOtherUsers = users.length > 3 ? users.length - 3 : 0;

  return (
    <Tooltip title={users.join(", ")}>
      <button
        className={styles.buttonUserDots}
        onClick={(e) => {
          e.stopPropagation();
          setVisibleScrim(true);
        }}
      >
        <UserDotsAccordion users={shownUsers} />
        {!!numberOtherUsers && (
          <OtherUsersButton numberOtherUsers={numberOtherUsers} />
        )}
      </button>
    </Tooltip>
  );
}

export function UserDotsAccordion(props: { users: string[] }): JSX.Element {
  const users = props.users.reverse();

  const numberOfUserDots =
    users.length == 1
      ? styles.oneUserDot
      : users.length == 2
      ? styles.twoUserDots
      : styles.threeUserDots;

  return (
    <div className={`${numberOfUserDots} ${styles.containerUserDots}`}>
      {users.map((name) => (
        <div key={name}>
          <UserDot name={name} />
        </div>
      ))}
    </div>
  );
}

export function OtherUsersButton(props: {
  numberOtherUsers: number;
}): JSX.Element {
  const { numberOtherUsers } = props;
  return (
    <div className={styles.otherUsersContainer}>
      <p className={styles.otherUsersText}>+{numberOtherUsers}</p>
    </div>
  );
}
