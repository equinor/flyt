import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./Projects.module.scss";
import Head from "next/head";
import { Pagination, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../../layouts/LayoutWrapper";
import { ProjectListSection } from "../../components/ProjectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import SideNavBar from "components/SideNavBar";

const itemsPerPage = 16; // increased from 19 to 100 since filtering (hiding project without name) is done on the client side
// it looks bad when every other page just have a few cards and others have more... Therefore it would be better to just show a greater amount of cards at once

export default function Projects(): JSX.Element {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ["projects", page, "isFavourite"],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        onlyFavorites: true,
      })
  );

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setTotalItems(data.totalItems);
  }, [data?.totalItems]);

  if (error)
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Projects</title>
          <link rel="icon" href={"/favicon.ico"} />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
          <Typography variant={"h3"}>{error.toString()}</Typography>
        </main>
      </div>
    );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.frontPageMain}>
        <SideNavBar />
        <div className={styles.contentContainer}>
          <div className={styles.contentHeader}>
            <Typography variant="h3">Favourite Projects</Typography>
          </div>
          <div className={styles.contentBottom}>
            <ProjectListSection
              projects={data?.projects}
              isLoading={isLoading}
              expectedNumberOfProjects={itemsPerPage}
              printNewProjectButton={false}
            />
            <div className={styles.contentFooter}>
              {itemsPerPage < totalItems && (
                <Pagination
                  key={`${totalItems}`}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  // withItemIndicator
                  defaultValue={page}
                  onChange={(event, newPage) => setPage(newPage)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
