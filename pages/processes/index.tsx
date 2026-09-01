import { ActiveFilterSection } from "components/Labels/ActiveFilterSection";
import { FilterLabelButton } from "components/Labels/FilterLabelButton";
import { FilterUserButton } from "components/FilterUserButton";
import { ProjectList } from "components/ProjectList";
import Head from "next/head";
import { Layouts } from "@/layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import { SideNavBar } from "components/SideNavBar";
import { SortSelect } from "@/components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import styles from "./FrontPage.module.scss";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getQueryAllProcesses } from "@/components/canvas/utils/projectQueries";

export default function AllProcesses() {
  const query = getQueryAllProcesses(35);
  useInfiniteScroll(query, 128);

  return (
    <>
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
          <ProjectList showNewProcessButton={true} query={query} />
        </div>
      </main>
    </>
  );
}

AllProcesses.layout = Layouts.Default;
AllProcesses.auth = true;
