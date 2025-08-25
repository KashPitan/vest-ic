import * as XLSX from "xlsx";

export function getWorksheetByName(workbook: XLSX.WorkBook, sheetName: string) {
  return workbook.Sheets[sheetName];
}

export const getAllChartData = (workbook: XLSX.WorkBook) => {
  const topThreeContributorsSheet = getWorksheetByName(
    workbook,
    "6.TopThreeContr",
  );

  const bottomThreeContributorsSheet = getWorksheetByName(
    workbook,
    "7.BottomThreeContr",
  );

  const cumulativePerformanceSheet = getWorksheetByName(
    workbook,
    "8.CumulativePerfDiscrete",
  );

  return {
    topThreeContributors: extractTwoColumnThreeRows(
      topThreeContributorsSheet,
      1,
      "A",
      4,
    ),
    bottomThreeContributors: extractTwoColumnThreeRows(
      bottomThreeContributorsSheet,
      1,
      "A",
      4,
    ),
    cumulativePerformance: extractTwoColumnThreeRows(
      cumulativePerformanceSheet,
      1,
      "A",
    ),
  };
};

export type TwoColumnData = [string, string][];

/**
 * Extracts a two-column, three-row data structure from a given worksheet.
 *
 * @param {XLSX.WorkSheet} sheet - The worksheet to extract data from.
 * @param {number} [startRow=1] - The starting row number (1-based).
 * @param {string} [startCol="A"] - The starting column letter.
 * @param {number} [numRows] - Optional. The number of rows to extract including header row. If not provided, extraction continues until two consecutive empty rows are found.
 * @returns {TwoColumnData} An array of [string, string] pairs representing the extracted rows.
 */

export function extractTwoColumnThreeRows(
  sheet: XLSX.WorkSheet,
  startRow: number = 1,
  startCol: string = "A",
  numRows?: number,
): TwoColumnData {
  const rows: TwoColumnData = [];
  const colB = String.fromCharCode(startCol.charCodeAt(0) + 1); // Next column

  // Helper function to extract cell values for a given row
  const extractRowValues = (rowNum: number): [string, string] => {
    const cellA = sheet[`${startCol}${rowNum}`];
    const cellB = sheet[`${colB}${rowNum}`];
    const valueA = cellA ? String(cellA.v).trim() : "";
    const valueB = cellB ? String(cellB.v).trim() : "";
    return [valueA, valueB];
  };

  if (numRows !== undefined) {
    // If numRows is specified, extract exactly that many rows
    for (let i = 0; i < numRows; i++) {
      const rowNum = startRow + i;
      const [valueA, valueB] = extractRowValues(rowNum);
      rows.push([valueA, valueB]);
    }
  } else {
    // Auto-detect data boundaries by looking for two consecutive empty rows
    let consecutiveEmptyRows = 0;
    let currentRow = startRow;

    while (consecutiveEmptyRows < 2) {
      const [valueA, valueB] = extractRowValues(currentRow);

      // Check if both cells are empty
      if (valueA === "" && valueB === "") {
        consecutiveEmptyRows++;
      } else {
        // Reset counter if we find a row with data
        consecutiveEmptyRows = 0;
        // Only add rows that have at least one non-empty value
        if (valueA !== "" || valueB !== "") {
          rows.push([valueA, valueB]);
        }
      }

      currentRow++;
    }
  }

  return rows;
}
