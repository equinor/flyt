import { useIsAuthenticated } from "@azure/msal-react";
import { NotAuthenticatedMessage } from "@/components/NotAuthenticatedMessage";
import { DefaultLayout } from "./default";
import { CanvasLayout } from "./canvas";
import { PropsWithChildren, ReactNode } from "react";

// ADD MORE LAYOUTS HERE
const layouts = {
  default: DefaultLayout,
  canvas: CanvasLayout,
  empty: function EmptyLayout(props: { children: ReactNode }) {
    return <>{props.children}</>;
  },
};

export const Layouts = {
  Default: "default",
  Canvas: "canvas",
  Empty: "empty",
};

export const LayoutWrapper = (props: PropsWithChildren) => {
  // @ts-ignore -- this works, and I cant be bothered to fix it
  const Layout = layouts[props.children?.type.layout];
  // @ts-ignore -- this works, and I cant be bothered to fix it
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
