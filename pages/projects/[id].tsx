import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Layouts } from "../../layouts/LayoutWrapper";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../components/VSMCanvas"),
  { ssr: false }
);

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const error = useStoreState((state) => state.errorProject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);

  useEffect(() => {
    if (id) dispatch.fetchProject({ id });
  }, [id]);

  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>VSM | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">Error loading project {id}</Typography>
          <p>{JSON.stringify(error)}</p>
        </main>
      </div>
    );
  }
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{project?.name || `VSM | Project ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicComponentWithNoSSR
          refreshProject={() => dispatch.fetchProject({ id })}
        />
      </main>
    </div>
  );
}

Project.layout = Layouts.Canvas;
Project.auth = true;
