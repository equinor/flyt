import store from "@/store/store";
import * as htmlToPng from "html-to-image";

function getDownloadFileName(processName?: string): string {
  const name = processName?.trim() || "Untitled-process";

  return `${name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "")}.png`;
}

export async function downloadCanvasAsPNG(processName?: string) {
  const node = document.querySelector(".react-flow") as HTMLElement;
  await document.fonts.ready;

  htmlToPng
    .toPng(node, {
      pixelRatio: 6,
      backgroundColor: "white",
      cacheBust: true,
      skipExternalFonts: true,
      style: { transform: "none" },
    } as any)
    .then((dataUrl) => {
      store
        .getActions()
        .setSnackMessage("The image file has been downloaded successfully.");
      store.getActions().setDownloadSnackbar(true);
      const link = document.createElement("a") as HTMLAnchorElement;
      link.download = getDownloadFileName(processName) as string;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      store
        .getActions()
        .setSnackMessage(
          "Oops! We couldn’t download the image. Please check your internet connection or try again."
        );
      store.getActions().setDownloadSnackbar(true);
      console.warn("Export failed");
    });
}
