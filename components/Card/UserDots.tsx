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
  const numberOtherUsers = users.length - shownUsers.length;

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
          <p className={styles.otherUsersText}>+{numberOtherUsers}</p>
        )}
      </button>
    </Tooltip>
  );
}

export function UserDotsAccordion(props: { users: string[] }): JSX.Element {
  const users = props.users.reverse();
  const width = users.length <= 3 ? 24 * users.length : 72;

  return (
    <div className={styles.containerUserDots} style={{ width: width }}>
      {users.map((name) => (
        <div key={name}>
          <UserDot name={name} />
        </div>
      ))}
    </div>
  );
}
