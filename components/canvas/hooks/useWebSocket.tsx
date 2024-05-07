import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { getAccessToken } from "../../../auth/msalHelpers";
import { useStoreDispatch } from "../../../hooks/storeHooks";
import { useUserAccount } from "./useUserAccount";

const useWebSocket = (projectId: string) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketReason, setSocketReason] = useState("");
  const dispatch = useStoreDispatch();
  const account = useUserAccount();

  useEffect(() => {
    let socket: Socket;

    const connectSocket = async () => {
      const accessToken = await getAccessToken();
      socket = io({ path: "/api/socket", auth: { token: accessToken } });

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      socket.on("disconnect", (reason) => {
        dispatch.setSnackMessage(`Socket disconnected because ${reason}`);
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

export default useWebSocket;
