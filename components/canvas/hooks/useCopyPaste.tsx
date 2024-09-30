import { useStoreDispatch } from "@/hooks/storeHooks";
import { NodeData } from "@/types/NodeData";
import { unknownErrorToString } from "@/utils/isError";
import { useEffect } from "react";
import { Node } from "reactflow";

export const useCopyPaste = (
  target: Node<NodeData> | undefined,
  action: (target: any) => void,
  validator?: (target: any) => void
) => {
  const dispatch = useStoreDispatch();

  const copyToClipboard = async (target: Node<NodeData> | undefined) => {
    try {
      if (target) {
        await navigator.clipboard.writeText(JSON.stringify(target));
        dispatch.setSnackMessage("Copied 📋");
      }
    } catch (error) {
      dispatch.setSnackMessage(unknownErrorToString(error));
    }
  };

  const paste = async () => {
    try {
      let targetToPaste = await navigator.clipboard.readText();
      targetToPaste = JSON.parse(targetToPaste);
      const valid = validator ? validator(targetToPaste) : true;
      if (valid) {
        action(targetToPaste);
      }
    } catch (error) {
      dispatch.setSnackMessage(unknownErrorToString(error));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (target && (event.metaKey || event.ctrlKey) && event.key === "c") {
        copyToClipboard(target);
      } else if ((event.metaKey || event.ctrlKey) && event.key === "v") {
        paste();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [target]);

  return { copyToClipboard, paste };
};
