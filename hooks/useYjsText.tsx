import { getAccessToken } from "@/auth/msalHelpers";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { UpdateNodeDataRequestBody } from "@/types/NodeDataApi";
import { unknownErrorToString } from "@/utils/isError";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { useProjectId } from "./useProjectId";
import { useAccount, useMsal } from "@azure/msal-react";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { debounce } from "@/utils/debounce";

export function useYjsText(fieldName: any, selectedNode: any) {
  const [value, setvalue] = useState(selectedNode[fieldName]);
  const ydocRef = useRef(new Y.Doc());
  const ydoc = ydocRef.current;
  const yText = ydoc.getText(fieldName);
  const socketRef = useRef<Socket | null>(null);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation(
    (patchedObject: UpdateNodeDataRequestBody) =>
      patchGraph(patchedObject, projectId, patchedObject.id),
    {
      onSuccess() {
        void notifyOthers("Updated a card", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  useEffect(() => {
    let socket: Socket;
    let onUpdate: any;
    let observer: any;
    const connectSocket = async () => {
      const accessToken = await getAccessToken();
      socket = io({
        path: "/api/socket",
        auth: { token: accessToken },
        reconnection: false,
      });

      socketRef.current = socket;

      socket.emit("join-doc", projectId);

      socket.on("init", (update) => {
        Y.applyUpdate(ydoc, update);
        setvalue(yText.toString());
      });

      socket.on("yjs-update", (update) => {
        console.log("client", update.length);
        Y.applyUpdate(ydoc, update);
        setvalue(yText.toString());
      });

      observer = () => {
        setvalue(yText.toString());
      };
      yText.observe(observer);

      onUpdate = (update: any, origin: any) => {
        socket.emit("yjs-update", update);
        saveSanpshot(update);
      };

      ydoc.on("update", onUpdate);
    };

    connectSocket();

    return () => {
      yText.unobserve(observer);
      ydoc.off("update", onUpdate);
      socket.off("init");
      socket.off("yjs-update");
    };
  }, [projectId]);

  function saveSanpshot(update: any) {
    debounce(() => {
      mutate({
        [fieldName]: yText.toString(),
        id: selectedNode.id,
      }),
        1500,
        `update ${fieldName} - ${selectedNode.id}`;
    });
  }

  function onChange(text: any) {
    ydoc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, text);
    });
    setvalue(text);
  }

  return { value, onChange };
}
