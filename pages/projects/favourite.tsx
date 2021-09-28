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
import { SortSelect } from "../../components/SortSelect";

export default function FavoriteProjects(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15; //Todo: Display as many cards we can fit while still making space for the pagination
  const router = useRouter();
  const { orderBy } = router.query;

  const query = useQuery(["favProjects", page, "isFavourite", orderBy], () =>
    getProjects({
      page,
      items: itemsPerPage,
      onlyFavorites: true,
      orderBy,
    })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Favorite projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <Typography variant="h3">Your favourite projects</Typography>
            <SortSelect />
          </div>
          <FrontPageBody
            itemsPerPage={itemsPerPage}
            query={query}
            showNewProjectButton={false}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
          />
        </div>
      </main>
    </div>
  );
}

FavoriteProjects.layout = Layouts.Default;
FavoriteProjects.auth = true;
