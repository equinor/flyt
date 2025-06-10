import { Task } from "@/types/Task";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { getFormattedPQIRData } from "./getFormattedPQIRData";

export function exportToSpreadsheetFiles(
  tasks: Task[] | undefined,
  value: string,
  projectTitle: string
) {
  const data = tasks ? getFormattedPQIRData(tasks) : [];

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //Naming file using current date
  const currentDate = new Date();
  const formattedDate = currentDate.toJSON().split("T")[0];
  const fileName = `${projectTitle}_PQIR_${formattedDate}`;

  // Export to xlsx
  if (value === "Excel") {
    XLSX.writeFileXLSX(workbook, `${fileName}.xlsx`);
  }

  // Export to CSV
  else {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, `${fileName}.csv`);
  }
}
