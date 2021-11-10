import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { unknownErrorToString } from "../../../utils/isError";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../components/canvas/Next"),
  { ssr: false }
);

export default function NextProcess() {
  const router = useRouter();
  const { id } = router.query;

  const { data: process, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );

  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Process {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
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
    <div className={commonStyles.container}>
      <Head>
        <title>{process?.name || `Flyt | Process ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicComponentWithNoSSR />
      </main>
    </div>
  );
}

NextProcess.layout = Layouts.Canvas;
NextProcess.auth = true;
