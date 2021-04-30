import Head from "next/head";
import { Icon, TopBar } from "@equinor/eds-core-react";
import {
  accessible,
  account_circle,
  edit,
  fullscreen,
  notifications,
} from "@equinor/eds-icons";
import styles from "./default.layout.module.scss";
import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import UserMenu from "../components/AppHeader/UserMenu";
import getConfig from "next/config";
import { HomeButton } from "./homeButton";

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  edit,
};

Icon.add(icons);

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
        <TopBar.Actions>
          <UserMenu />
        </TopBar.Actions>
      </TopBar>

      {children}
    </>
  );
};

export default DefaultLayout;
