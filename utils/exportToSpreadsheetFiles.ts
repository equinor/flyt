import ExcelJS from "exceljs";
import { Task } from "@/types/Task";
import { saveAs } from "file-saver";
import { getFormattedPQIRData } from "./getFormattedPQIRData";

export const exportToSpreadsheetFiles = async (
  tasks: Task[] | undefined,
  value: string,
  projectTitle: string
) => {
  const data = tasks ? getFormattedPQIRData(tasks) : [];

  // Create a new workbook and append the worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  //Add the headers into worksheet
  worksheet.columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
  }));
  worksheet.getRow(1).font = { bold: true };

  //Add the data into worksheet
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  //Naming file using process name and current date
  const currentDate = new Date();
  const formattedDate = currentDate.toJSON().split("T")[0];
  const fileName = `${projectTitle}_PQIR_${formattedDate}`;

  if (value === "Excel") {
    // Export to xlsx
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
  } else {
    // Export to csv
    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  }
};
