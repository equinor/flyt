import { useState } from "react";
import { useAccount, useMsal } from "@azure/msal-react";

import { ActiveFilterSection } from "components/Labels/ActiveFilterSection";
import { FilterLabelButton } from "components/Labels/FilterLabelButton";
import { FilterUserButton } from "components/FilterUserButton";
import { FrontPageBody } from "components/FrontPageBody";
import Head from "next/head";
import { Layouts } from "@/layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import { SideNavBar } from "components/SideNavBar";
import { SortSelect } from "@/components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import { getProjects } from "@/services/projectApi";
import { getUserShortName } from "@/utils/getUserShortName";
import { getUserByShortname } from "services/userApi";
import { stringToArray } from "utils/stringHelpers";
import styles from "./FrontPage.module.scss";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function MyProcesses() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();

  //Get my user
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const shortName = account ? getUserShortName(account) : "";

  const { data: users } = useQuery(["userName"], () =>
    getUserByShortname(shortName)
  );

  const myUserId = users?.find((user) => user.userName === shortName)?.pkUser;
  const requiredUsers = stringToArray(router.query.user);
  const query = useQuery(
    [
      "myProjects",
      page,
      myUserId,
      itemsPerPage,
      router.query.q,
      requiredUsers,
      router.query.rl,
      router.query.orderBy,
    ],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: stringToArray(router.query.q),
        ru: myUserId ? [...requiredUsers, myUserId] : requiredUsers,
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      }),
    { enabled: !!myUserId }
  );

  return (
    <div>
      <Head>
        <title>Flyt | My processes</title>
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
              <Typography variant="h3">My processes</Typography>
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
            itemsPerPage={itemsPerPage}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
            query={query}
            showNewProcessButton={true}
          />
        </div>
      </main>
    </div>
  );
}

MyProcesses.layout = Layouts.Default;
MyProcesses.auth = true;
