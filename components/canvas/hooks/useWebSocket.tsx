import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { Socket, io } from "socket.io-client";
import { getAccessToken } from "../../../auth/msalHelpers";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { useProjectId } from "../../../hooks/useProjectId";
import { useUserAccount } from "./useUserAccount";

export const useWebSocket = () => {
  const { projectId } = useProjectId();
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");
  const dispatch = useStoreDispatch();
  const account = useUserAccount();
  const queryClient = useQueryClient();

  const socketRef = useRef<Socket | null>(null);
  const hasConnectedOnce = useRef(false);

  useEffect(() => {
    let socket: Socket;

    const connectSocket = async () => {
      const accessToken = await getAccessToken();
      socket = io({
        path: "/api/socket",
        auth: { token: accessToken },
        reconnection: false,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setSocketConnected(true);

        if (hasConnectedOnce.current) {
          dispatch.setNetworkSnackMessage(
            "Reconnected successfully. You're back online! "
          );
          dispatch.setDownloadSnackbar(true);
        }
        hasConnectedOnce.current = true;
      });

      socket.on("disconnect", (reason) => {
        setSocketConnected(false);
        setSocketReason(reason);

        if (reason === "io client disconnect") return;

        if (!hasConnectedOnce.current) return;

        dispatch.setNetworkSnackMessage(
          " You're offline. Please check your internet connection."
        );
        dispatch.setDownloadSnackbar(true);
      });

      socket.on("connect_error", (error) => {
        console.log("Error", error);
        setSocketConnected(false);
        setSocketReason(error.message);
      });

      socket.on(`room-${projectId}`, (payload) => {
        if (payload.user !== account?.username?.split("@")[0]) {
          dispatch.setSnackMessage(
            `${payload.fullName ? payload.fullName : "Someone"} ${payload.msg}`
          );
        }
        queryClient.invalidateQueries();
      });
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [projectId, account, dispatch]);

  const reconnect = async () => {
    if (!navigator.onLine) return;
    if (socketRef.current?.connected) return;

    socketRef.current?.connect();
  };

  return { socketConnected, socketReason, reconnect };
};
