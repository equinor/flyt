import React from "react";
import "../styles/globals.scss";
import LayoutWrapper from "../layouts/LayoutWrapper";
import AuthenticationProvider from "../auth/AuthenticationProvider";
import { StoreProvider } from "easy-peasy";
import store from "../store/store";
import App, { AppContext } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

//Todo: get rid of the StoreProvider. (Simplify our workflow by using React-Query for server state data-handling and interactions)
const queryClient = new QueryClient();
const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <LayoutWrapper {...pageProps}>
            <Component {...pageProps} />
          </LayoutWrapper>
        </AuthenticationProvider>
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
