import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Pagination, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../../layouts/LayoutWrapper";
import { ProjectListSection } from "../../components/ProjectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import SideNavBar from "components/SideNavBar";
import FrontPageHeader from "components/FrontPageHeader";
import { useRouter } from "next/router";

const itemsPerPage = 15;
export default function Projects(): JSX.Element {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { orderBy } = router.query;

  const { data, isLoading, error } = useQuery(["projects", page, orderBy], () =>
    getProjects({
      page,
      items: itemsPerPage,
      orderBy: orderBy.toString(),
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

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <FrontPageHeader title="All Projects" />
          </div>
          {data?.totalItems != 0 ? (
            <div className={styles.frontPageBody}>
              <ProjectListSection
                projects={data?.projects}
                isLoading={isLoading}
                expectedNumberOfProjects={itemsPerPage}
                showNewProjectButton={true}
              />
              <div className={styles.frontPageFooter}>
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
            <p>There are no projects to display.</p>
          )}
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
