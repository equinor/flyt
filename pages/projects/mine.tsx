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
import SortMenu from "../../components/SortMenu";

export default function MyProjects(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 14; //Todo: how many items?
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const userNameFilter = getUserShortName(account);

  const router = useRouter();
  const { orderBy } = router.query;

  const query = useQuery(["myProjects", page, userNameFilter, orderBy], () =>
    getProjects({
      page,
      user: userNameFilter,
      items: itemsPerPage,
      orderBy: orderBy.toString(),
    })
  );

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | FavoriteProjects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <div className={styles.frontPageHeader}>
            <Typography variant="h3">Your projects</Typography>
            <SortMenu />
          </div>
          <FrontPageBody
            itemsPerPage={15}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
            query={query}
            showNewProjectButton={true}
          />
        </div>
      </main>
    </div>
  );
}

MyProjects.layout = Layouts.Default;
MyProjects.auth = true;
