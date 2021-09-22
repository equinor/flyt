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
import { debounce } from "utils/debounce";
import SortMenu from "components/SortMenu";

const itemsPerPage = 16;
export default function Projects(): JSX.Element {
  const [page, setPage] = useState(1);
  const [queryString, setQueryString] = useState("");
  const [orderBy, setOrderBy] = useState("name");

  const { data, isLoading, error } = useQuery(
    ["projects", page, queryString, orderBy],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: queryString,
        orderBy,
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <input
                className={styles.searchField}
                type="text"
                placeholder="Search content"
                onChange={(e) => {
                  debounce(
                    () => setQueryString(e.target.value),
                    500,
                    "projectSearch"
                  );
                }}
              />
              <SortMenu setOrderBy={(any: string) => setOrderBy(any)} />
            </div>
          </div>
          {data?.totalItems != 0 ? (
            <div className={styles.contentBottom}>
              <ProjectListSection
                projects={data?.projects}
                isLoading={isLoading}
                expectedNumberOfProjects={itemsPerPage}
                showNewProjectButton={false}
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
          ) : (
            <div>There are no projects matching the search criteria.</div>
          )}
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
