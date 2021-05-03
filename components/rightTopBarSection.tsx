import { Button, Icon, TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import UserMenu from "./AppHeader/UserMenu";
import React from "react";

export function RightTopBarSection(props: { isAuthenticated: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <a
        href="https://forms.office.com/Pages/ResponsePage.aspx?id=NaKkOuK21UiRlX_PBbRZsGXJ18p1yVhOjLvQbqMNiVBUQUQyVUFYMkZRVUZPUk5TWjBESERGMFVUTiQlQCN0PWcu"
        className="href"
        target="_blank"
        rel="noreferrer"
      >
        <Button
          style={{ marginRight: 12 }}
          variant={"ghost_icon"}
          title={"Give feedback"}
        >
          <Icon name={"comment_important"} />
        </Button>
      </a>
      {props.isAuthenticated && (
        <div className={styles.userCircle}>
          <TopBar.Actions>
            <UserMenu />
          </TopBar.Actions>
        </div>
      )}
    </div>
  );
}
