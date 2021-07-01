import { useRouter } from "next/router";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import React from "react";
import { useQuery } from "react-query";
import { getTasksForProject } from "../../services/taskApi";
import { unknownErrorToString } from "../../utils/isError";
import { taskObject } from "../../interfaces/taskObject";

export default function TablePage() {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery("projects", () =>
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
        <div>{JSON.stringify(tasks)}</div>
        <table>
          <thead>
            <tr>
              <th>DisplayID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{}</td>
            </tr>
          </tbody>
        </table>

        <div>
          {tasks?.map((task: taskObject) => {
            return (
              <div key={task.vsmTaskID} style={{ display: "flex" }}>
                {/*<p>{task.fkTaskType}</p>*/}
                <p>{task.displayIndex}</p>
                <div>{JSON.stringify(task)}</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
