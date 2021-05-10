import Head from "next/head";
import { TopBar } from "@equinor/eds-core-react";
import styles from "./default.layout.module.scss";
import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import getConfig from "next/config";
import { HomeButton } from "./homeButton";
import { RightTopBarSection } from "../components/rightTopBarSection";

const DefaultLayout = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { publicRuntimeConfig } = getConfig();

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Authentication Required</title>
          <meta charSet="utf-8" />
          {/*link manifest.json*/}
          <link rel="manifest" href="/manifest.json" />
          {/*this sets the color of url bar */}
          <meta name="theme-color" content="#F7F7F7" />
        </Head>

        <TopBar className={styles.topBar}>
          <HomeButton />
          <div />
          <RightTopBarSection isAuthenticated={isAuthenticated} />
        </TopBar>

        {children}
      </>
    );
  }
  return (
    <>
      <Head>
        <title>{publicRuntimeConfig.APP_NAME}</title>
        <meta charSet="utf-8" />
        {/*link manifest.json*/}
        <link rel="manifest" href="/manifest.json" />
        {/*this sets the color of url bar */}
        <meta name="theme-color" content="#F7F7F7" />
      </Head>

      <TopBar className={styles.topBar}>
        <HomeButton />
        <div />
        <RightTopBarSection isAuthenticated={isAuthenticated} />
      </TopBar>

      {children}
    </>
  );
};

export default DefaultLayout;
