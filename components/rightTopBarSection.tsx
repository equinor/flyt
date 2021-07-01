import { Icon, TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import UserMenu from "./AppHeader/UserMenu";
import React from "react";
import { bar_chart, comment_important, info_circle } from "@equinor/eds-icons";
import { LinkIcon } from "./linkIcon";

const icons = {
  bar_chart,
  comment_important,
  info_circle,
};

Icon.add(icons);

export function RightTopBarSection(props: {
  isAuthenticated: boolean;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <LinkIcon
        helpText="Open Power BI Dashboard"
        iconName="bar_chart"
        link="https://app.powerbi.com/groups/cad7c965-c975-4e58-8cbb-d06ea30d8950/reports/bc52b0ff-fd14-4b85-8ddb-246d11f3dbb7/ReportSection5ac160214341b78811d2"
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
