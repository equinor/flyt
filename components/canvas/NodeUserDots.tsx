import { userAccess } from "@/types/UserAccess";
import { UserDots } from "../Card/UserDots";
import styles from "./Node.module.scss";

type NodeUserDotsProps = {
  userAccesses: userAccess[];
  onClick?: () => void;
};

export const NodeUserDots = ({ userAccesses, onClick }: NodeUserDotsProps) => (
  <div className={styles["node__userdots-container"]}>
    <UserDots
      userAccesses={userAccesses}
      onClick={() => onClick && onClick()}
      hideTooltip
    />
  </div>
);
