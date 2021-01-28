import { useHistory } from "react-router-dom";
import { Button, Icon, TopBar } from "@equinor/eds-core-react";
import React from "react";
import { UserDot } from "./UserDot";
import { useAccount, useMsal } from "@azure/msal-react";

export function AppTopBar(props: {
  style?: React.CSSProperties | undefined;
}): JSX.Element {
  const history = useHistory();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  return (
    <div style={props.style}>
      <TopBar>
        <TopBar.Header
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/")}
        >
          Visual Stream Map
        </TopBar.Header>
        <TopBar.Actions>
          <Button variant={"ghost_icon"} onClick={() => history.push("/user")}>
            {account?.name ? (
              <UserDot name={`${account.name}`} />
            ) : (
              <Icon name="account_circle" size={24} title="user" />
            )}
          </Button>
        </TopBar.Actions>
      </TopBar>
    </div>
  );
}
