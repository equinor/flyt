import React from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import SideNavBar from "components/SideNavBar";
import FrontPageHeader from "components/FrontPageHeader";
import FrontPageBody from "components/FrontPageBody";
export default function Projects(): JSX.Element {
  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.frontPageMain}>
        <SideNavBar />
        <div className={styles.frontPageContainer}>
          <FrontPageHeader title="All Projects" />
          <FrontPageBody pageType="index" />
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
