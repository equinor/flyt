import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import { getTasksForProject } from "@/services/taskApi";
import { unknownErrorToString } from "@/utils/isError";
import { QipCard } from "@/components/QipCard";
import { Layouts } from "@/layouts/LayoutWrapper";
import { io } from "socket.io-client";
import { TaskTypes } from "types/TaskTypes";
import { useProjectId } from "@/hooks/useProjectId";

export default function QipsPage(): JSX.Element {
  const { projectId } = useProjectId();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery(["tasks", projectId], () => getTasksForProject(projectId));

  const queryClient = useQueryClient();

  useEffect((): any => {
    // connect to socket server
    const socket = io(process.env.BASE_URL ?? "", {
      path: "/api/socketio",
    });
    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    socket.on(`room-${projectId}`, (message) => {
      void queryClient.invalidateQueries(message?.queryKey);
    });

    // socket disconnect onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

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
          ?.sort((a, b) => TaskTypes[a.type].length - TaskTypes[b.type].length)
          .map((task) => (
            <Link key={task.id} href={`/process/${projectId}/qips/${task.id}`}>
              <QipCard task={task} />
            </Link>
          ))
      )}
    </div>
  );
}

QipsPage.layout = Layouts.Default;
QipsPage.auth = true;
