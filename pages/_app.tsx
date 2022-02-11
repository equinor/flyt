import "../styles/globals.scss";

import App, { AppContext } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

import { Head } from "next/document";
import LayoutWrapper from "../layouts/LayoutWrapper";
import { MsalProvider } from "@azure/msal-react";
import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { StoreProvider } from "easy-peasy";
import msalInstance from "../auth/msalHelpers";
import store from "../store/store";

const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  return (
    // Todo: get rid of the StoreProvider. (Simplify our workflow by using React-Query for server state data-handling and interactions)
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <MsalProvider instance={msalInstance}>
          <LayoutWrapper {...pageProps}>
            <Component {...pageProps} />
          </LayoutWrapper>
        </MsalProvider>
        <div onWheel={(e) => e.stopPropagation()}>
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </QueryClientProvider>
    </StoreProvider>
  );
};

export default MyApp;

// Turning off Automatic static optimization. Because runtime environment variables via docker https://github.com/vercel/next.js/discussions/15651#discussioncomment-110494
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
