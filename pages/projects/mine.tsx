import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Pagination, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../../layouts/LayoutWrapper";
import { ProjectListSection } from "../../components/ProjectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { getUserShortName } from "../../utils/getUserShortName";
import SideNavBar from "components/SideNavBar";
import FrontPageHeader from "components/FrontPageHeader";
import { useRouter } from "next/router";

const itemsPerPage = 16;
export default function Projects(): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const userNameFilter = getUserShortName(account);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { orderBy } = router.query;

  const { data, isLoading, error } = useQuery(
    ["myProjects", page, userNameFilter, orderBy],
    () =>
      getProjects({
        page,
        user: userNameFilter,
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
            <FrontPageHeader title="My Projects" />
          </div>
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
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
