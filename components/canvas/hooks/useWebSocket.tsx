import { useEffect, useState } from "react";
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

  useEffect(() => {
    let socket: Socket;

    const connectSocket = async () => {
      const accessToken = await getAccessToken();
      socket = io({ path: "/api/socket", auth: { token: accessToken } });

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      socket.on("disconnect", (reason) => {
        setSocketConnected(false);
        setSocketReason(reason);
      });

      socket.on("connect_error", (error) => {
        console.log("Error", error);
        setSocketConnected(false);
        setSocketReason(error.message);
      });

      socket.on(`room-${projectId}`, (payload) => {
        if (payload.user !== account?.username?.split("@")[0]) {
          dispatch.setSnackMessage(
            `${payload.user ? payload.user : "Someone"} ${payload.msg}`
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

  return { socketConnected, socketReason };
};
