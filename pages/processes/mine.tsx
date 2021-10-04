import React, { useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import FrontPageBody from "components/FrontPageBody";
import SideNavBar from "components/SideNavBar";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import { getUserShortName } from "../../utils/getUserShortName";
import { useAccount, useMsal } from "@azure/msal-react";
import { useRouter } from "next/router";
import { Typography } from "@equinor/eds-core-react";
import { SortSelect } from "../../components/SortSelect";
import { SearchField } from "components/SearchField";

export default function MyProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15; //Todo: Display as many cards we can fit while still making space for the pagination

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const userNameFilter = getUserShortName(account);

  const router = useRouter();
  const { searchQuery, orderBy } = router?.query;

  const query = useQuery(
    ["myProjects", page, userNameFilter, searchQuery || "", orderBy],
    () =>
      getProjects({
        page,
        user: userNameFilter,
        items: itemsPerPage,
        q: searchQuery || "",
        orderBy,
      })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | My processes</title>
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
              <Typography variant="h3">My processes</Typography>
              <SortSelect />
            </div>
          </div>
          <FrontPageBody
            itemsPerPage={itemsPerPage}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
            query={query}
            showNewProjectButton={true}
          />
        </div>
      </main>
    </div>
  );
}

MyProcesses.layout = Layouts.Default;
MyProcesses.auth = true;
