import * as XLSX from "xlsx";
import { toPercentNumber, toPercentStringIfNumeric } from "./formatters";

export function getWorksheetByName(workbook: XLSX.WorkBook, sheetName: string) {
  return workbook.Sheets[sheetName];
}

export const getAllChartData = (
  workbook: XLSX.WorkBook,
  options?: { inceptionPerformance?: InceptionPerformanceDataOptions },
) => {
  const topTenHoldingsSheet = getWorksheetByName(workbook, "1.TopHoldings");

  const assetAllocationSheet = getWorksheetByName(
    workbook,
    "2.AssetAllocation",
  );

  const equitiesBreakdownSheet = getWorksheetByName(
    workbook,
    "3.EquitiesBreakdown",
  );

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
  const fundInfoSheet = getWorksheetByName(workbook, "14.FundInfo");
  const keyBuysSheet = getWorksheetByName(workbook, "10.KeyBuys");
  const keySellsSheet = getWorksheetByName(workbook, "11.KeySells");
  const monthlyPerformanceSheet = getWorksheetByName(
    workbook,
    "13.MonthlyPerf",
  );

  const topTenRows = topTenHoldingsSheet
    ? extractTwoColumnData(topTenHoldingsSheet, 2, "F", 2)
    : [];
  const topTenSplit = topTenRows
    .map(([label, rawVal]) => ({
      label: String(label).trim(),
      value: normalizePercent(rawVal),
    }))
    .filter((x) => x.label && Number.isFinite(x.value));

  const assetAllocationRows = assetAllocationSheet
    ? extractTwoColumnData(assetAllocationSheet, 2, "A")
    : [];
  const assetAllocation = assetAllocationRows
    .map(([label, rawVal]) => ({
      label: String(label).trim(),
      value: normalizePercent(rawVal),
    }))
    .filter((x) => x.label && Number.isFinite(x.value));

  const equitiesBreakdownRows = equitiesBreakdownSheet
    ? extractTwoColumnData(equitiesBreakdownSheet, 2, "A")
    : [];
  const equitiesBreakdown = equitiesBreakdownRows
    .map(([label, rawVal]) => ({
      label: String(label).trim(),
      value: normalizePercent(rawVal),
    }))
    .filter((x) => x.label && Number.isFinite(x.value));

  const fixedIncomeBreakdownSheet = getWorksheetByName(
    workbook,
    "4.FixedIncomeBreakdown",
  );
  const fixedIncomeBreakdownRows = fixedIncomeBreakdownSheet
    ? extractTwoColumnData(fixedIncomeBreakdownSheet, 2, "A")
    : [];
  const fixedIncomeBreakdown = fixedIncomeBreakdownRows
    .map(([label, rawVal]) => ({
      label: String(label).trim(),
      value: normalizePercent(rawVal),
    }))
    .filter((x) => x.label && Number.isFinite(x.value));

  return {
    topTenSplit,
    assetAllocation,
    equitiesBreakdown,
    fixedIncomeBreakdown,
    topThreeContributors: extractTwoColumnData(
      topThreeContributorsSheet,
      1,
      "A",
      4,
    ),
    bottomThreeContributors: extractTwoColumnData(
      bottomThreeContributorsSheet,
      1,
      "A",
      4,
    ),
    cumulativePerformance: extractTwoColumnData(
      cumulativePerformanceSheet,
      1,
      "A",
    ),
    twelveMonthCumulativePerformance: extractTwoColumnData(
      twelveMonthCumulativePerformanceSheet,
      1,
      "A",
      4,
    ),
    cumulativeStrategyPerformance: getInceptionPerformanceData(
      inceptionPerfSheet,
      options?.inceptionPerformance,
    ),
    fundInfo: extractTwoColumnData(fundInfoSheet),
    keyBuys: extractRowsData(keyBuysSheet, ["A", "B", "C", "D"], 1),
    keySells: extractRowsData(keySellsSheet, ["A", "B", "C", "D"], 1),
    monthlyPerformance: extractTableData(monthlyPerformanceSheet, "J", 3, 14),
  };
};

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

export type LabelValue = { label: string; value: number };

// Normalize decimals/percent numbers/strings to a percent number (e.g., 17.3)
const normalizePercent = (raw: unknown, def = NaN): number => {
  if (raw === null || raw === undefined) return def;

  if (typeof raw === "number")
    return raw <= 1 ? Number((raw * 100).toFixed(2)) : Number(raw.toFixed(2));

  const s = String(raw).trim();
  if (!s || s.startsWith("#")) return def; // #REF!, #N/A, etc.

  const stripped = s.endsWith("%") ? s.slice(0, -1) : s;
  const num = Number(stripped);
  if (!Number.isFinite(num)) return def;

  return num <= 1 ? Number((num * 100).toFixed(2)) : Number(num.toFixed(2));
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

  // y axes - these will vary per product
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

    // these are percentage values in the spreadsheet, when pulled from excel
    // they're converted e.g. 2% -> 0.02. We want this to show as 2 instead so
    // converting back using the decimalToPercentage function
    const series1Value = toPercentNumber(series1Cell?.v, 0);
    const series2Value = toPercentNumber(series2Cell?.v, 0);

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

export type KeyValuePairData = [string, string][];

/**
 * Extracts a two-column, three-row data structure from a given worksheet.
 *
 * @param {XLSX.WorkSheet} sheet - The worksheet to extract data from.
 * @param {number} [startRow=1] - The starting row number (1-based).
 * @param {string} [startCol="A"] - The starting column letter.
 * @param {number} [numRows] - Optional. The number of rows to extract including header row. If not provided, extraction continues until two consecutive empty rows are found.
 * @returns {KeyValuePairData} An array of [string, string] pairs representing the extracted rows.
 */

export function extractTwoColumnData(
  sheet: XLSX.WorkSheet,
  startRow: number = 1,
  startCol: string = "A",
  numRows?: number,
): KeyValuePairData {
  const rows: KeyValuePairData = [];
  const colB = String.fromCharCode(startCol.charCodeAt(0) + 1); // Next column

  // Helper function to extract cell values for a given row
  const extractRowValues = (rowNum: number): [string, string] => {
    const cellA = sheet[`${startCol}${rowNum}`];
    const cellB = sheet[`${colB}${rowNum}`];
    const valueA = cellA ? cellA.v : "";
    const valueB = cellB ? cellB.v : "";

    const formattedA = toPercentStringIfNumeric(valueA);
    const formattedB = toPercentStringIfNumeric(valueB);

    return [formattedA, formattedB];
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

/**
 * Extracts 2 rows from an Excel worksheet, where the first row contains keys
 * and the second row contains corresponding values, from the specified columns.
 *
 * @param {XLSX.WorkSheet} sheet - The worksheet to extract data from
 * @param {string[]} columns - Array of column letters (e.g., ['A', 'B', 'C'])
 * @param {number} startRow - Starting row number (1-based) for the keys
 * @returns {KeyValuePairData} Array of key-value pairs, where each pair is a [string, string]
 */
export function extractRowsData(
  sheet: XLSX.WorkSheet,
  columns: string[],
  startRow: number,
): KeyValuePairData {
  const keyRow = startRow;
  const valueRow = startRow + 1;
  const pairs: KeyValuePairData = [];

  for (const col of columns) {
    // Get the key from the first row of the specified column
    const keyCellRef = `${col}${keyRow}`;
    const keyCell = sheet[keyCellRef];
    const key = keyCell ? toPercentStringIfNumeric(keyCell.v) : "";

    // Get the value from the second row of the specified column
    const valueCellRef = `${col}${valueRow}`;
    const valueCell = sheet[valueCellRef];
    const value = valueCell ? toPercentStringIfNumeric(valueCell.v) : "";

    // Push the key-value pair to the result array
    pairs.push([key, value]);
  }

  return pairs;
}

/**
 * Extracts table data starting from a specified header cell (default I3).
 * Reads 14 columns across and continues down until an empty row is found.
 *
 * @param {XLSX.WorkSheet} sheet - The worksheet to extract data from
 * @param {string} [headerCol="J"] - The starting column letter for headers
 * @param {number} [headerRow=3] - The row number containing headers
 * @param {number} [numColumns=14] - Number of columns to read
 * @returns {{headerCellValue: string, data: string[][]}} Object containing header cell value and data rows array
 */
export function extractTableData(
  sheet: XLSX.WorkSheet,
  headerCol: string = "J",
  headerRow: number = 3,
  numColumns: number = 14,
): { headerCellValue: string; data: string[][] } {
  const data: string[][] = [];
  const startColCode = headerCol.charCodeAt(0);

  // Extract the header cell value (the cell at the starting position)
  const headerCellRef = `${headerCol}${headerRow}`;
  const headerCell = sheet[headerCellRef];
  const headerCellValue = headerCell ? String(headerCell.v) : "";

  // Start from the row after the header
  let currentRow = headerRow + 1;

  while (true) {
    const row: string[] = [];
    let hasData = false;

    // Read the specified number of columns for this row and check if any cell has data
    for (let colOffset = 0; colOffset < numColumns; colOffset++) {
      const colLetter = String.fromCharCode(startColCode + colOffset);
      const cellRef = `${colLetter}${currentRow}`;
      const cell = sheet[cellRef];

      if (cell) {
        // First column (row header) uses raw value, others get percentage formatting
        const cellValue =
          colOffset === 0 ? cell.v : toPercentStringIfNumeric(cell.v);
        row.push(cellValue);
        hasData = true;
      } else {
        row.push("");
      }
    }

    // If the entire row is empty, stop processing
    if (!hasData) {
      break;
    }

    data.push(row);
    currentRow++;
  }

  return { headerCellValue, data };
}
