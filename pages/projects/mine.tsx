import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import FrontPageHeader from "components/FrontPageHeader";
import FrontPageBody from "components/FrontPageBody";
import SideNavBar from "components/SideNavBar";
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
          <FrontPageHeader title="My Projects" />
          <FrontPageBody pageType="mine" />
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
