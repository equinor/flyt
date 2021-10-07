import React from "react";
import styles from "./UserDotsAccordion.module.scss";
import { UserDot } from "./UserDot";

export default function UserDotsAccordion(props: {
  users: string[];
  callbackFunction: (any: boolean) => void;
}): JSX.Element {
  return (
    <button
      className={styles.dotsContainer}
      onClick={(e) => {
        e.stopPropagation();
        props.callbackFunction(true);
      }}
    >
      {props.users.map((name) => (
        <div key={name}>
          <UserDot name={name} />
        </div>
      ))}
    </button>
  );
}
