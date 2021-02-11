import Head from "next/head";
import { Button, Icon, TopBar, Typography } from "@equinor/eds-core-react";
import { accessible, account_circle, fullscreen, notifications } from "@equinor/eds-icons";
import styles from "./default.layout.module.scss";
import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import UserMenu from "../components/AppHeader/UserMenu";
import Link from "next/link";
import { useRouter } from "next/router";
import getConfig from "next/config";

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen
};

Icon.add(icons);

const DefaultLayout = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const login = () => {
    router.push("/login");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Authentication Required</title>
          <meta charSet="utf-8" />
        </Head>

        <TopBar className={styles.topBar}>
          <Link href={"/"}>
            <Typography className={styles.title} variant={"h4"}>
              VSM
            </Typography>
          </Link>
          {/*<TopBar.Actions>*/}
          {/*  <Button onClick={login} color="primary">*/}
          {/*    Login*/}
          {/*  </Button>*/}
          {/*</TopBar.Actions>*/}
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
      </Head>

      <TopBar className={styles.topBar}>
        <Link href={"/"}>
          <Typography className={styles.title} variant={"h4"}>
            VSM
          </Typography>
        </Link>
        <TopBar.Actions>
          <UserMenu />
        </TopBar.Actions>
      </TopBar>

      {children}
    </>
  );
};

export default DefaultLayout;
