// import commonStyles from ";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
// import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "services/projectApi";
import { unknownErrorToString } from "utils/isError";
import { Layouts } from "layouts/LayoutWrapper";
// import { getProject } from "../../../services/projectApi";
// import { unknownErrorToString } from "../../../utils/isError";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../components/canvas/Beta"),
  { ssr: false }
);

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const { data: project, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );

  if (error) {
    return (
      <div>
        <Head>
          <title>Flyt | Process {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Typography variant="h1">{unknownErrorToString(error)}</Typography>
          <p>
            We have some troubles with this process. Please try to refresh the
            page.
          </p>
        </main>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{project?.name || `Flyt | Process ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicComponentWithNoSSR />
      </main>
    </div>
  );
}

Project.layout = Layouts.Canvas;
Project.auth = true;
