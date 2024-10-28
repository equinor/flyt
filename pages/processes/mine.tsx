import { useAccount, useMsal } from "@azure/msal-react";

import { ActiveFilterSection } from "components/Labels/ActiveFilterSection";
import { FilterLabelButton } from "components/Labels/FilterLabelButton";
import { FilterUserButton } from "components/FilterUserButton";
import { ProjectList } from "../../components/ProjectList";
import Head from "next/head";
import { Layouts } from "@/layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import { SideNavBar } from "components/SideNavBar";
import { SortSelect } from "@/components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import { getUserShortName } from "@/utils/getUserShortName";
import { getUserByShortname } from "services/userApi";
import { stringToArray } from "utils/stringHelpers";
import styles from "./FrontPage.module.scss";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getQueryMyProcesses } from "@/components/canvas/utils/projectQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function MyProcesses() {
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
  const query = getQueryMyProcesses(15, myUserId, requiredUsers);
  useInfiniteScroll(query);

  return (
    <>
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
          <ProjectList query={query} showNewProcessButton={true} />
        </div>
      </main>
    </>
  );
}

MyProcesses.layout = Layouts.Default;
MyProcesses.auth = true;
