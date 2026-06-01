import { TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import { UserMenu } from "./AppHeader/UserMenu";
import { bar_chart, comment_important, info_circle } from "@equinor/eds-icons";
import { LinkIcon } from "./LinkIcon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const powerBIMainUrl =
  "https://app.powerbi.com/groups/cad7c965-c975-4e58-8cbb-d06ea30d8950/reports/bc52b0ff-fd14-4b85-8ddb-246d11f3dbb7/ReportSection0d40e3767db82b646971?experience=power-bi";
const powerBIProcessUrl =
  "https://app.powerbi.com/groups/cad7c965-c975-4e58-8cbb-d06ea30d8950/reports/bc52b0ff-fd14-4b85-8ddb-246d11f3dbb7/605fbc579a888b483a53?experience=power-bi&filter=VSM/PkVsm eq";

export function RightTopBarSection(props: {
  isAuthenticated: boolean;
}): JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const [powerBIUrl, setPowerBIUrl] = useState(powerBIMainUrl);

  useEffect(() => {
    if (router.pathname.includes("/process/")) {
      const url = `${powerBIProcessUrl} ${id}`;
      setPowerBIUrl(url);
    }
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <LinkIcon
        helpText="Open Power BI Dashboard"
        icon={bar_chart}
        link={powerBIUrl}
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
