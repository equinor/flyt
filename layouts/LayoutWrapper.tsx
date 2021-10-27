import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import NotAuthenticatedMessage from "../components/NotAuthenticatedMessage";
import DefaultLayout from "./default";
import CanvasLayout from "./canvas";

// ADD MORE LAYOUTS HERE
const layouts = {
  default: DefaultLayout,
  canvas: CanvasLayout,
  empty: function EmptyLayout(props: { children }) {
    return <>{props.children}</>;
  },
};

export const Layouts = {
  Default: "default",
  Canvas: "canvas",
  Empty: "empty",
};

const LayoutWrapper = (props) => {
  const Layout = layouts[props.children?.type.layout];
  const authRequired = props.children?.type.auth;
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated && authRequired)
    return (
      <DefaultLayout {...props}>
        <NotAuthenticatedMessage />
      </DefaultLayout>
    );

  if (Layout) return <Layout {...props}>{props.children}</Layout>;
  return <DefaultLayout {...props}>{props.children}</DefaultLayout>;
};

export default LayoutWrapper;
