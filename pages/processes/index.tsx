import React, { useState } from "react";

import ActiveFilterSection from "components/Labels/ActiveFilterSection";
import FilterLabelButton from "components/Labels/FilterLabelButton";
import FilterUserButton from "components/FilterUserButton";
import FrontPageBody from "components/FrontPageBody";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import SideNavBar from "components/SideNavBar";
import { SortSelect } from "../../components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import { getProjects } from "../../services/projectApi";
import { stringToArray } from "utils/stringToArray";
import styles from "./FrontPage.module.scss";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function AllProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();
  const query = useQuery(
    [
      "projects",
      page,
      itemsPerPage,
      router.query.q,
      router.query.user,
      router.query.rl,
      router.query.orderBy,
    ],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: stringToArray(router.query.q),
        ru: stringToArray(router.query.user),
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      })
  );

  return (
    <div>
      <Head>
        <title>Flyt | All processes</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.main}>
        <SideNavBar />
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.subHeader}>
              <SearchField />
            </div>
            <div className={styles.subHeader}>
              <Typography variant="h3">All processes</Typography>
              <div className={styles.sortAndFilter}>
                <FilterUserButton />
                <FilterLabelButton />
                <SortSelect />
              </div>
            </div>
            <div className={styles.subHeader}>
              <ActiveFilterSection />
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
