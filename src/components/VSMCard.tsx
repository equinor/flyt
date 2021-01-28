import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useAccount, useMsal } from "@azure/msal-react";
import { UserDots } from "./UserDots";

interface VSMInterface {
  vsmProjectID: number;
  name: string;
  created: string;
  updated: string;
}

export function VSMCard(props: { vsm: VSMInterface }): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  return (
    <Link
      to={{
        pathname: "/vsm",
        search: `project=${props.vsm.vsmProjectID}`,
      }}
      className="card appear noselect"
    >
      <div style={{ flex: 1, margin: 16 }}>
        <h1 className="vsmTitle">{props.vsm.name}</h1>
      </div>
      <div>
        <hr style={{ opacity: 0.1 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="vsmLabel" style={{ margin: 12 }}>
            Edited {moment(props.vsm.updated).fromNow()}
          </p>
          {/*Todo: Show users who are relevant for each VSMCard instead of current user*/}
          {account && <UserDots users={[`${account.name}`]} />}
        </div>
      </div>
    </Link>
  );
}
