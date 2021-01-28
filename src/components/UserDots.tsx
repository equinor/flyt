import { UserDot } from "./UserDot";
import React from "react";

export function UserDots(props: { users: Array<string> }): JSX.Element {
  return (
    <div style={{ display: "flex", margin: 12, flexWrap: "wrap" }}>
      {props.users.map((name, i) => (
        <UserDot key={i} name={name} />
      ))}
    </div>
  );
}
