import React, { useState } from "react";
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
import FilterLabelButton from "components/Labels/FilterLabelButton";
import { getQueryObject } from "utils/getQueryObject";
import LabelSubHeader from "components/Labels/LabelSubHeader";

export default function FavoriteProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;

  const router = useRouter();
  const urlQueryObject = getQueryObject({}, router.query);

  const query = useQuery(
    ["favProjects", page, "isFavourite", ...Object.values(urlQueryObject)],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        onlyFavorites: true,
        ...urlQueryObject,
      })
  );

  const labelsID = router.query.rl ? `${router.query.rl}`.split(",") : null;

  return (
    <div>
      <Head>
        <title>Flyt | Favorite processes</title>
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
              <Typography variant="h3">My favourite processes</Typography>
              <div className={styles.sortAndFilter}>
                <FilterLabelButton />
                <SortSelect />
              </div>
            </div>
            {labelsID && (
              <div className={styles.subHeader}>
                <LabelSubHeader labelsID={labelsID} />
              </div>
            )}
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

FavoriteProcesses.layout = Layouts.Default;
FavoriteProcesses.auth = true;
