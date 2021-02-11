import { useIsAuthenticated } from "@azure/msal-react";
import NotAuthenticatedMessage from "../components/NotAuthenticatedMessage";
import DefaultLayout from "./default";

// ADD MORE LAYOUTS HERE
const layouts = {
  default: DefaultLayout
};

export const Layouts = {
  Default: "default"
};

const LayoutWrapper = props => {
  const Layout = layouts[props.children?.type.layout];
  const authRequired = props.children?.type.auth;
  const isAuthenticated = useIsAuthenticated();

  const authedComponent =
    (!isAuthenticated && authRequired)
      ? <NotAuthenticatedMessage />
      : props.children;

  if (Layout != null) {
    return <Layout {...props}>{authedComponent}</Layout>;
  }
  return <DefaultLayout {...props}>{authedComponent}</DefaultLayout>;
};

export default LayoutWrapper;
