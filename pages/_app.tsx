import React from "react";
import "../styles/globals.scss";
import LayoutWrapper from "../layouts/LayoutWrapper";
import AuthenticationProvider from "../auth/AuthenticationProvider";
import { StoreProvider } from "easy-peasy";
import store from "../store/store";
import App, { AppContext } from "next/app";

const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider store={store}>
      <AuthenticationProvider>
        <LayoutWrapper {...pageProps}>
          <Component {...pageProps} />
        </LayoutWrapper>
      </AuthenticationProvider>
    </StoreProvider>
  );
};

export default MyApp;

// Turning off Automatic static optimization. Because runtime environment variables via docker https://github.com/vercel/next.js/discussions/15651#discussioncomment-110494
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

