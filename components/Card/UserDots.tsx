import { Tooltip } from "@equinor/eds-core-react";
import { UserDot } from "../UserDot";
import styles from "./UserDots.module.scss";
import { userAccess } from "types/UserAccess";

export function UserDots(props: {
  userAccesses: userAccess[];
  setVisibleScrim: (any: boolean) => void;
}): JSX.Element {
  const { userAccesses, setVisibleScrim } = props;
  const shownUsers =
    userAccesses.length > 3 ? userAccesses.slice(0, 3) : userAccesses;
  const numberOtherUsers = userAccesses.length - shownUsers.length;

  return (
    <Tooltip
      title={userAccesses.map((userAccess) => userAccess.fullName).join(", ")}
    >
      <button
        className={styles.buttonUserDots}
        onClick={(e) => {
          e.preventDefault();
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

function UserDotsAccordion(props: { users: userAccess[] }): JSX.Element {
  const users = props.users.reverse();
  const width = users.length <= 3 ? 24 * users.length : 72;

  return (
    <div className={styles.containerUserDots} style={{ width: width }}>
      {users.map((userAccess) => (
        <div key={userAccess.user}>
          <UserDot name={userAccess.user} />
        </div>
      ))}
    </div>
  );
}
