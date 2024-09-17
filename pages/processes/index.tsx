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
import styles from "./FrontPage.module.scss";
import { useProcessesQuery } from "@/hooks/useProcessesQuery";

export default function AllProcesses() {
  const { query } = useProcessesQuery();

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
