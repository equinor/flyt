export function mergeAndDownload(
  csvHeaders: string,
  csvFileData: (number | "Left" | "Right" | string)[][],
  fileName: string
): void {
  //merge the data into a CSV-string
  let csv = csvHeaders;
  csvFileData.forEach((row) => {
    csv += row.join(",");
    csv += "\n";
  });

  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded
  hiddenElement.download = fileName;
  hiddenElement.click();
  hiddenElement.remove();
}
