import { Button, Icon, TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import UserMenu from "./AppHeader/UserMenu";
import React from "react";
import {
  bar_chart,
  category,
  comment_important,
  info_circle,
} from "@equinor/eds-icons";
import { LinkIcon } from "./LinkIcon";
import { useRouter } from "next/router";

export function RightTopBarSection(props: {
  isAuthenticated: boolean;
}): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {id && (
        <Button
          onClick={() => router.push(`/projects/${id}/categories`)}
          variant={"ghost_icon"}
          title={"Categorise PQIs"}
        >
          <Icon data={category} />
        </Button>
      )}

      <LinkIcon
        helpText="Open Power BI Dashboard"
        icon={bar_chart}
        link="https://app.powerbi.com/Redirect?action=OpenApp&appId=3f0b9d13-eb0a-4845-8868-15420556cfe9&ctid=3aa4a235-b6e2-48d5-9195-7fcf05b459b0"
        style={{ marginRight: 8 }}
      />
      <LinkIcon
        helpText="Open Wiki"
        icon={info_circle}
        link="https://wiki.equinor.com/wiki/index.php/Flyt"
        style={{ marginRight: 8 }}
      />
      <LinkIcon
        helpText="Give feedback"
        icon={comment_important}
        link="https://forms.office.com/Pages/ResponsePage.aspx?id=NaKkOuK21UiRlX_PBbRZsGXJ18p1yVhOjLvQbqMNiVBUQUQyVUFYMkZRVUZPUk5TWjBESERGMFVUTiQlQCN0PWcu"
        style={{ marginRight: 8 }}
      />
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
