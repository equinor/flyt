import { Tooltip } from "@equinor/eds-core-react";
import { userAccess } from "types/UserAccess";
import { fullNameListToString } from "../canvas/utils/fullnameListToString";
import { UserDot } from "../UserDot";
import styles from "./UserDots.module.scss";

export function UserDots(props: {
  userAccesses: userAccess[];
  onClick: () => void;
  hideTooltip?: boolean;
}): JSX.Element {
  const { userAccesses, onClick, hideTooltip } = props;
  const shownUsers =
    userAccesses.length > 3 ? userAccesses.slice(0, 3) : userAccesses;
  const numberOtherUsers = userAccesses.length - shownUsers.length;
  const fullNames = fullNameListToString(userAccesses);

  return (
    <Tooltip title={fullNames} hidden={hideTooltip} placement="top">
      <button
        className={styles.buttonUserDots}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
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
