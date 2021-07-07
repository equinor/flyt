import { useRouter } from "next/router";
import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import React from "react";
import { useQuery } from "react-query";
import { getTasksForProject } from "../../../services/taskApi";
import { unknownErrorToString } from "../../../utils/isError";
import { flattenProject } from "../../../utils/flattenProject";
import { getProject } from "../../../services/projectApi";
import ObjectTable from "../../../components/objectTable";
import TaskTable from "../../../components/taskTable";

export default function TablePage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery("tasks", () => getTasksForProject(id));
  const { data: project } = useQuery("project", () =>
    getProject(id.toString())
  );

  if (isLoading) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">Loading...</Typography>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">{unknownErrorToString(error)}</Typography>
        </main>
      </div>
    );
  }
  const flatObjects = flattenProject(project);
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Project {id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={commonStyles.main}>
        <Typography variant="h1">Project {id}</Typography>
        <Typography variant="h2">Cards</Typography>
        <ObjectTable vsmObjects={flatObjects} />
        <Typography variant="h2">QIPs</Typography>
        <TaskTable tasks={tasks} />
      </main>
    </div>
  );
}
