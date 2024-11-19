import { ActiveFilterSection } from "components/Labels/ActiveFilterSection";
import { FilterLabelButton } from "components/Labels/FilterLabelButton";
import { FilterUserButton } from "components/FilterUserButton";
import { ProjectList } from "../../components/ProjectList";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import { SideNavBar } from "components/SideNavBar";
import { SortSelect } from "../../components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import styles from "./FrontPage.module.scss";
import { getQueryFavProcesses } from "@/components/canvas/utils/projectQueries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function FavoriteProcesses(): JSX.Element {
  const query = getQueryFavProcesses(16);
  useInfiniteScroll(query, 128);

  return (
    <>
      <Head>
        <title>Flyt | Favorite processes</title>
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
              <Typography variant="h3">My favourite processes</Typography>
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
          <ProjectList query={query} showNewProcessButton={false} />
        </div>
      </main>
    </>
  );
}

FavoriteProcesses.layout = Layouts.Default;
FavoriteProcesses.auth = true;
