import Head from "next/head";
import { TopBar } from "@equinor/eds-core-react";
import styles from "./default.layout.module.scss";
import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import { HomeButton } from "./homeButton";
import { RightTopBarSection } from "../components/RightTopBarSection";
import packageJson from "../package.json";
import { ServiceMessageBanner } from "../components/ServiceMessageBanner";

const DefaultLayout = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

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
          <RightTopBarSection />
        </TopBar>

        {children}
      </>
    );
  }
  return (
    <>
      <Head>
        <title>{packageJson.name}</title>
        <meta charSet="utf-8" />
        {/*link manifest.json*/}
        <link rel="manifest" href="/manifest.json" />
        {/*this sets the color of url bar */}
        <meta name="theme-color" content="#F7F7F7" />
      </Head>

      <TopBar className={styles.topBar}>
        <HomeButton />
        <div />
        <RightTopBarSection />
      </TopBar>
      <ServiceMessageBanner />

      {children}
    </>
  );
};

export default DefaultLayout;
