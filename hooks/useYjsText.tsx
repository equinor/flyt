import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { useAccount, useMsal } from "@azure/msal-react";
import { getAccessToken } from "@/auth/msalHelpers";
import { patchGraph } from "@/services/graphApi";
import { notifyOthers } from "@/services/notifyOthers";
import { UpdateNodeDataRequestBody } from "@/types/NodeDataApi";
import { unknownErrorToString } from "@/utils/isError";
import { useProjectId } from "./useProjectId";
import { useStoreDispatch } from "@/hooks/storeHooks";
import { debounce } from "@/utils/debounce";
import { NodeDataCommon } from "@/types/NodeData";

export function useYjsText(selectedNode: any) {
  const initialValues = {
    description: selectedNode.description,
    role: selectedNode.role,
    duration: selectedNode.duration,
    unit: selectedNode.unit,
  };
  const [values, setValues] = useState<Record<string, any>>(initialValues);

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

  const ydocRef = useRef(new Y.Doc());
  const ydoc = ydocRef.current;
  const yTexts: Record<string, Y.Text> = {
    description: ydoc.getText("description"),
    role: ydoc.getText("role"),
    duration: ydoc.getText("duration"),
    unit: ydoc.getText("unit"),
  };
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    //Set the inital values in yText
    Object.entries(initialValues).forEach(([fieldName, value]) => {
      const yText = yTexts[fieldName];
      if (yText) {
        yText.delete(0, yText.length);
        yText.insert(0, String(value));
      }
    });
  }, [projectId]);

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
        setValues(
          Object.fromEntries(
            Object.entries(yTexts).map(([name, yText]) => [
              name,
              yText.toString(),
            ])
          )
        );
      });

      socket.on("yjs-update", (buffer: ArrayBuffer) => {
        const update = new Uint8Array(buffer);
        Y.applyUpdate(ydoc, update);
        setValues(
          Object.fromEntries(
            Object.entries(yTexts).map(([name, yText]) => [
              name,
              yText.toString(),
            ])
          )
        );
      });

      Object.entries(yTexts).forEach(([fieldName, yText]) => {
        yText.observe(() => {
          setValues((prev) => ({
            ...prev,
            [fieldName]: yText.toString(),
          }));
        });
      });

      onUpdate = (update: any) => {
        socket.emit("yjs-update", update);
      };

      ydoc.on("update", onUpdate);
    };

    connectSocket();

    return () => {
      ydoc.off("update", onUpdate);
      socket.off("init");
      socket.off("yjs-update");
    };
  }, [projectId]);

  function saveSanpshot(fieldName: any) {
    const value = yTexts[fieldName];
    debounce(() => {
      mutate({
        [fieldName]: value.toString(),
        id: selectedNode.id,
      }),
        1500,
        `update ${fieldName} - ${selectedNode.id}`;
    });
  }

  function onChange(value: any, fieldName: any) {
    const text = value ? String(value) : "";
    ydoc.transact(() => {
      const yText = yTexts[fieldName];
      yText.delete(0, yText.length);
      yText.insert(0, text);
    });
    setValues((prev) => ({ ...prev, [fieldName]: text }));
    saveSanpshot(fieldName);
  }

  return { values, onChange };
}
