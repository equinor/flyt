import { Button, Icon, TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import UserMenu from "./AppHeader/UserMenu";
import React from "react";
import {
  bar_chart,
  comment_important,
  download,
  info_circle,
} from "@equinor/eds-icons";
import { LinkIcon } from "./linkIcon";
import Link from "next/link";

const icons = {
  bar_chart,
  comment_important,
  info_circle,
};

Icon.add(icons);

export function RightTopBarSection(props: {
  isAuthenticated: boolean;
  projectId: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Link href={`/download/${props.projectId}`}>
        <Button
          variant={"ghost_icon"}
          title={"Download"}
          // style={props.style}
        >
          <Icon data={download} />
        </Button>
      </Link>
      <LinkIcon
        helpText="Open Power BI Dashboard"
        iconName="bar_chart"
        link="https://app.powerbi.com/Redirect?action=OpenApp&appId=3f0b9d13-eb0a-4845-8868-15420556cfe9&ctid=3aa4a235-b6e2-48d5-9195-7fcf05b459b0"
        style={{ marginRight: 8 }}
      />
      <LinkIcon
        helpText="Open Wiki"
        iconName="info_circle"
        link="https://wiki.equinor.com/wiki/index.php/Flyt"
        style={{ marginRight: 8 }}
      />
      <LinkIcon
        helpText="Give feedback"
        iconName="comment_important"
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