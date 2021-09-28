import React, { useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import SideNavBar from "components/SideNavBar";
import FrontPageBody from "components/FrontPageBody";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import { useRouter } from "next/router";
import { Typography } from "@equinor/eds-core-react";
import SortMenu from "../../components/SortMenu";

export default function AllProjects(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 14; //Todo: how many items?
  const router = useRouter();
  const { orderBy } = router.query;

  const query = useQuery(["projects", page, orderBy], () =>
    getProjects({
      page,
      items: itemsPerPage,
      orderBy: orderBy.toString(),
    })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | FavoriteProjects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <Typography variant="h3">All projects</Typography>
            <SortMenu />
          </div>
          <FrontPageBody
            showNewProjectButton={true}
            itemsPerPage={15}
            query={query}
            onChangePage={(newPage) => setPage(newPage)}
          />
        </div>
      </main>
    </div>
  );
}

AllProjects.layout = Layouts.Default;
AllProjects.auth = true;
