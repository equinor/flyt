import { useRouter } from "next/router";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import React from "react";
import { useQuery } from "react-query";
import { getTasksForProject } from "../../services/taskApi";
import { unknownErrorToString } from "../../utils/isError";

export default function TablePage() {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery("tasks", () =>
    getTasksForProject(parseFloat(projectId.toString()))
  );

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
  if (error) {
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
        <table>
          <thead>
            <tr>
              {Object.keys(tasks[0]).map((k) => {
                return <th key={k.toString()}>{k}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              return (
                <tr key={task.vsmTaskID}>
                  {Object.keys(task).map((k) => {
                    return (
                      <td key={`${k}-${task.vsmTaskID}`}>
                        {task && task[k] && task[k].toString()}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
