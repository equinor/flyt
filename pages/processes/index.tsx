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
import { SearchField } from "components/SearchField";
import FilterLabelBox from "components/FilterLabelBox";
import FilterLabelButton from "components/FilterLabelButton";

export default function AllProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15; //Todo: Display as many cards we can fit while still making space for the pagination

  const router = useRouter();
  const { searchQuery, orderBy } = router?.query;

  const query = useQuery(["projects", page, searchQuery || "", orderBy], () =>
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
        <title>Flyt | All processes</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <div className={styles.frontPageSubHeader}>
              <SearchField />
            </div>
            <div className={styles.frontPageSubHeader}>
              <Typography variant="h3">All processes</Typography>
              <div className={styles.sortAndFilter}>
                <FilterLabelButton />
                <SortSelect />
              </div>
            </div>
          </div>
          <FrontPageBody
            showNewProjectButton={true}
            itemsPerPage={itemsPerPage}
            query={query}
            onChangePage={(newPage) => setPage(newPage)}
          />
        </div>
      </main>
    </div>
  );
}

AllProcesses.layout = Layouts.Default;
AllProcesses.auth = true;
