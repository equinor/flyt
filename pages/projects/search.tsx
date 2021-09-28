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
import SortMenu from "../../components/SortMenu";
import { SearchField } from "../../components/SearchField";

export default function SearchProjects(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 14; //Todo: how many items?

  const router = useRouter();
  const { searchQuery, orderBy } = router?.query;
  const query = useQuery(
    ["searchedProjects", page, searchQuery || "", orderBy],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: router?.query?.searchQuery,
        orderBy: orderBy.toString(),
      })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <SearchField />
            <SortMenu />
          </div>
          <FrontPageBody
            itemsPerPage={15}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
            query={query}
            showNewProjectButton={false}
          />
        </div>
      </main>
    </div>
  );
}

SearchProjects.layout = Layouts.Default;
SearchProjects.auth = true;
