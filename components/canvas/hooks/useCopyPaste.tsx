import { useStoreDispatch } from "@/hooks/storeHooks";
import { useEffect } from "react";

export const useCopyPaste = (
  target: any,
  action: (target: any) => void,
  validator?: (target: any) => void
) => {
  const dispatch = useStoreDispatch();

  const copyToClipboard = async (target: any) => {
    try {
      const valid = validator ? validator(target) : true;
      if (valid) {
        await navigator.clipboard.writeText(JSON.stringify(target));
        dispatch.setSnackMessage("Copied 📋");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const paste = async () => {
    try {
      let targetToPaste = await navigator.clipboard.readText();
      targetToPaste = JSON.parse(targetToPaste);
      const valid = validator ? validator(targetToPaste) : true;
      if (valid) {
        dispatch.setSnackMessage("Pasted 📝");
        action(targetToPaste);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "c") {
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
