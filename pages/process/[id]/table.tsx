import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useQuery } from "react-query";
import { getTasksForProject } from "@/services/taskApi";
import { unknownErrorToString } from "@/utils/isError";
import { TaskTable } from "@/components/TaskTable";
import { useProjectId } from "@/hooks/useProjectId";

export default function TablePage() {
  const { projectId } = useProjectId();
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery("tasks", () => getTasksForProject(projectId));

  if (isLoading) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {projectId}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">Loading...</Typography>
        </main>
      </div>
    );
  }
  if (error || !tasks) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {projectId}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">{unknownErrorToString(error)}</Typography>
        </main>
      </div>
    );
  }

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Project {projectId}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={commonStyles.main}>
        <Typography variant="h1">Project {projectId}</Typography>
        <Typography variant="h2">Cards</Typography>
        <Typography variant="h2">QIPs</Typography>
        <TaskTable tasks={tasks} />
      </main>
    </div>
  );
}
