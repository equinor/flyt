import React from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTasksForProject } from "../../../../services/taskApi";
import { unknownErrorToString } from "../../../../utils/isError";
import { QipCard } from "../../../../components/QipCard";
import { Layouts } from "../../../../layouts/LayoutWrapper";

export default function QipsPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(["tasks", id], () => getTasksForProject(id));

  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: 12,
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tasks
          ?.sort((a, b) => a.fkTaskType - b.fkTaskType)
          .map((task) => (
            <Link key={task.vsmTaskID} href={`qips/${task.vsmTaskID}`}>
              <QipCard key={task.vsmTaskID} task={task} />
            </Link>
          ))
      )}
    </div>
  );
}

QipsPage.layout = Layouts.Default;
QipsPage.auth = true;
