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
import { SearchField } from "../../components/SearchField";
import { SortSelect } from "../../components/SortSelect";

export default function SearchProjects(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 16; //Todo: Display as many cards we can fit while still making space for the pagination

  const router = useRouter();
  const { searchQuery, orderBy } = router?.query;
  const query = useQuery(
    ["searchedProjects", page, searchQuery || "", orderBy],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: searchQuery || "",
        orderBy,
      })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Search Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <SearchField />
            <SortSelect />
          </div>
          <FrontPageBody
            itemsPerPage={itemsPerPage}
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
