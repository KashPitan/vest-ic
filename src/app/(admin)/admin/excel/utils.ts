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

  const twelveMonthCumulativePerformanceSheet = getWorksheetByName(
    workbook,
    "9.12mPerfDiscrete",
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
    twelveMonthCumulativePerformance: extractTwoColumnThreeRows(
      twelveMonthCumulativePerformanceSheet,
      1,
      "A",
      4,
    ),
  };
};

export type TwoColumnData = [string, string][];

export type InceptionPerformanceData = {
  dates: string[];
  series1: number[];
  series2: number[];
};

/**
 * Extracts inception performance data from the 12.InceptionPerfData sheet.
 * Retrieves data from columns I and K using column D as the x-axis (dates).
 *
 * @param {XLSX.WorkBook} workbook - The workbook containing the data
 * @returns {InceptionPerformanceData} Object containing dates and two data series
 */
export const getInceptionPerformanceData = (
  workbook: XLSX.WorkBook,
): InceptionPerformanceData => {
  const sheet = getWorksheetByName(workbook, "12.InceptionPerfData");

  if (!sheet) {
    console.warn("Sheet '12.InceptionPerfData' not found");
    return { dates: [], series1: [], series2: [] };
  }

  const dates: string[] = [];
  const series1: number[] = [];
  const series2: number[] = [];

  // Start from row 2 (assuming row 1 is header)
  let row = 2;

  while (true) {
    const dateCell = sheet[`D${row}`];
    const series1Cell = sheet[`I${row}`];
    const series2Cell = sheet[`K${row}`];

    // Stop if we reach an empty date cell
    if (!dateCell || !dateCell.v) {
      break;
    }

    // Extract date value
    const dateValue = dateCell.v;
    let dateString: string;

    if (typeof dateValue === "number") {
      // Excel date number - convert to date string
      const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
      dateString = excelDate.toISOString().split("T")[0];
    } else {
      dateString = String(dateValue);
    }

    // Extract series values (convert to numbers, default to 0 if invalid)
    const series1Value =
      series1Cell && !isNaN(Number(series1Cell.v)) ? Number(series1Cell.v) : 0;
    const series2Value =
      series2Cell && !isNaN(Number(series2Cell.v)) ? Number(series2Cell.v) : 0;

    dates.push(dateString);
    series1.push(series1Value);
    series2.push(series2Value);

    row++;
  }

  return { dates, series1, series2 };
};

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
