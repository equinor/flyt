import { useEffect } from "react";

import { ActiveFilterSection } from "components/Labels/ActiveFilterSection";
import { FilterLabelButton } from "components/Labels/FilterLabelButton";
import { FilterUserButton } from "components/FilterUserButton";
import { InfiniteFrontPageBody } from "components/InfiniteFrontPageBody";
import Head from "next/head";
import { Layouts } from "@/layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import { SideNavBar } from "components/SideNavBar";
import { SortSelect } from "@/components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import { getProjects } from "@/services/projectApi";
import { stringToArray } from "utils/stringToArray";
import styles from "./FrontPage.module.scss";
import { useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";

export default function AllProcesses() {
  const itemsPerPage = 15;

  const router = useRouter();
  const query = useInfiniteQuery(
    [
      "projects",
      itemsPerPage,
      router.query.q,
      router.query.user,
      router.query.rl,
      router.query.orderBy,
    ],
    ({ pageParam = 1 }) =>
      getProjects({
        page: pageParam,
        items: itemsPerPage,
        q: stringToArray(router.query.q),
        ru: stringToArray(router.query.user),
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const hasMorePages = lastPage.projects.length === itemsPerPage;
        if (!hasMorePages) return undefined;
        return allPages.length + 1;
      },
    }
  );

  useEffect(() => {
    const onScroll = () => {
      if (
        query.hasNextPage &&
        !query.isFetchingNextPage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 128
      ) {
        void query.fetchNextPage();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [query.hasNextPage, query.isFetchingNextPage]);

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
          <InfiniteFrontPageBody showNewProcessButton={true} query={query} />
        </div>
      </main>
    </div>
  );
}

AllProcesses.layout = Layouts.Default;
AllProcesses.auth = true;
