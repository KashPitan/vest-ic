import * as XLSX from "xlsx";

export function getWorksheetByName(workbook: XLSX.WorkBook, sheetName: string) {
  return workbook.Sheets[sheetName];
}

export const getAllChartData = (
  workbook: XLSX.WorkBook,
  options?: { inceptionPerformance?: InceptionPerformanceDataOptions },
) => {
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

  const inceptionPerfSheet = getWorksheetByName(
    workbook,
    "12.InceptionPerfData",
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
    cumulativeStrategyPerformance: getInceptionPerformanceData(
      inceptionPerfSheet,
      options?.inceptionPerformance,
    ),
  };
};

const decimalToPercentage = (value: number) => Number((value * 100).toFixed(2));

export type InceptionPerformanceData = {
  dates: string[];
  series1: number[];
  series2: number[];
  series1Heading: string;
  series2Heading: string;
};

type InceptionPerformanceDataOptions = {
  dateCol?: string;
  series1Col?: string;
  series2Col?: string;
  startRow?: number;
  headingRow?: number;
};

/**
 * Extracts inception performance data from a worksheet with configurable columns.
 * Defaults to dates in column D, series1 in H, and series2 in K.
 *
 * @param {XLSX.WorkSheet} sheet - The worksheet containing the data
 * @param {{dateCol?: string, series1Col?: string, series2Col?: string, startRow?: number, headingRow?: number}} [options]
 * @returns {InceptionPerformanceData} Object containing dates and two data series
 */
export const getInceptionPerformanceData = (
  sheet: XLSX.WorkSheet,
  options?: InceptionPerformanceDataOptions,
): InceptionPerformanceData => {
  // x axis
  const dateCol = options?.dateCol ?? "D";

  // y axes
  const series1Col = options?.series1Col ?? "H";
  const series2Col = options?.series2Col ?? "I";
  const startRow = options?.startRow ?? 2; // assuming row 1 is header
  const headingRow = options?.headingRow ?? 1;

  const dates: string[] = [];
  const series1: number[] = [];
  const series2: number[] = [];

  let row = startRow;

  while (true) {
    const dateCell = sheet[`${dateCol}${row}`];
    const series1Cell = sheet[`${series1Col}${row}`];
    const series2Cell = sheet[`${series2Col}${row}`];

    if (!dateCell || !dateCell.v) {
      break;
    }

    const dateValue = dateCell.v;
    let dateString: string;

    if (typeof dateValue === "number") {
      const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
      dateString = excelDate.toISOString().split("T")[0];
    } else {
      dateString = String(dateValue);
    }

    const series1Value =
      series1Cell && !isNaN(series1Cell.v)
        ? decimalToPercentage(series1Cell.v)
        : 0;
    const series2Value =
      series2Cell && !isNaN(series2Cell.v)
        ? decimalToPercentage(series2Cell.v)
        : 0;

    dates.push(dateString);
    series1.push(series1Value);
    series2.push(series2Value);

    row++;
  }

  const series1HeadingCell = sheet[`${series1Col}${headingRow}`];
  const series2HeadingCell = sheet[`${series2Col}${headingRow}`];

  return {
    dates,
    series1,
    series2,
    series1Heading: series1HeadingCell ? series1HeadingCell.v : "",
    series2Heading: series2HeadingCell ? series2HeadingCell.v : "",
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
