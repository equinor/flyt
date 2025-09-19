import * as htmlToPng from "html-to-image";

export async function downloadCanvasAsPNG() {
  const node = document.querySelector(".react-flow") as HTMLElement;
  if (!node) {
    console.log("React flow canvas not found");
    return;
  }
  htmlToPng
    .toPng(node, {
      pixelRatio: 6,
      backgroundColor: "black",
      cacheBust: true,
      style: { transform: "none" },
      skipFonts: true,
    } as any)
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `flow_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.warn("Export failed");
    });
}
