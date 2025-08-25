import * as XLSX from "xlsx";

export function getWorksheetByName(workbook: XLSX.WorkBook, sheetName: string) {
  return workbook.Sheets[sheetName];
}

export const getAllChartData = (workbook: XLSX.WorkBook) => {
  const topThreeContributorsSheet = getWorksheetByName(
    workbook,
    "6.TopThreeContr",
  );

  return {
    topThreeContributors: extractTwoColumnThreeRows(topThreeContributorsSheet),
  };
};

export type TwoColumnThreeRowData = [string, string][];

export function extractTwoColumnThreeRows(
  sheet: XLSX.WorkSheet,
): TwoColumnThreeRowData {
  const rows: TwoColumnThreeRowData = [];
  for (let i = 1; i <= 4; i++) {
    const cellA = sheet[`A${i}`];
    const cellB = sheet[`B${i}`];
    const valueA = cellA ? String(cellA.v) : "";
    const valueB = cellB ? String(cellB.v) : "";
    rows.push([valueA, valueB]);
  }
  return rows;
}
