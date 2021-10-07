import React from "react";
import styles from "./UserDots.module.scss";
import UserDotsAccordion from "./UserDotsAccordion";

export function UserDots(props: {
  users: Array<string>;
  setVisibleScrim: (any: boolean) => void;
}): JSX.Element {
  const { users, setVisibleScrim } = props;
  const shownUsers =
    users.length > 3 ? users.slice(0, 3).reverse() : users.reverse();
  const numberOtherUsers = users.length > 3 ? users.length - 3 : 0;

  return (
    <div className={styles.container}>
      <UserDotsAccordion
        users={shownUsers}
        callbackFunction={setVisibleScrim}
      />

      {!!numberOtherUsers && (
        <OtherUsersButton
          numberOtherUsers={numberOtherUsers}
          callbackFunction={setVisibleScrim}
        />
      )}
    </div>
  );
}

export function OtherUsersButton(props: {
  numberOtherUsers: number;
  callbackFunction: (any: boolean) => void;
}): JSX.Element {
  const { numberOtherUsers, callbackFunction } = props;
  return (
    <button
      className={styles.otherUsersContainer}
      onClick={(e) => {
        e.stopPropagation();
        callbackFunction(true);
      }}
    >
      <p className={styles.otherUsersText}>+{numberOtherUsers}</p>
    </button>
  );
}
