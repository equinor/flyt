import { useRouter } from "next/router";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import React from "react";
import { useQuery } from "react-query";
import { getTasksForProject } from "../../services/taskApi";
import { unknownErrorToString } from "../../utils/isError";
import { taskObject } from "../../interfaces/taskObject";
import { getVSMObjects } from "../../services/vsmObjectApi";
import { FlattenProject } from "../../utils/flattenProject";
import { getProject } from "../../services/projectApi";

function TaskTable({ tasks }: { tasks: Array<taskObject> }) {
  return (
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
  );
}

function ObjectTable({ vsmObjects }: { vsmObjects }) {
  if (vsmObjects && vsmObjects.length > 0) {
    return (
      <table>
        <thead>
          <tr>
            {Object.keys(vsmObjects[0]).map((k) => {
              return <th key={k.toString()}>{k}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {vsmObjects.map((o) => {
            return (
              <tr key={o.vsmObjectID}>
                {Object.keys(o).map((k) => {
                  return (
                    <td key={`${k}-${o.vsmObjectID}`}>
                      {o && o[k] && o[k].toString()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return <p>No vsmObjects</p>;
}

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
  const { data: project } = useQuery("project", () =>
    getProject(projectId.toString())
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
  const flatObjects = FlattenProject(project);
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Project {projectId}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={commonStyles.main}>
        <Typography variant="h1">Project {projectId}</Typography>
        <Typography variant="h2">Cards</Typography>
        <ObjectTable vsmObjects={flatObjects} />
        <Typography variant="h2">QIPs</Typography>
        <TaskTable tasks={tasks} />
      </main>
    </div>
  );
}
