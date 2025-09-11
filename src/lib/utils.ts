import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import sanitizeHtml from "sanitize-html";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizePostContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedSchemes: ["data", "https"],
  });
}

/**
 * Extracts a date from the end of a filename in the format yyyy_mm_dd
 * and converts it to the specified date format using date-fns
 *
 * @param fileName - The filename containing the date at the end
 * @param dateFormat - The desired output format (e.g., 'yyyy-MM-dd', 'MMM dd, yyyy')
 * @returns The formatted date string, or null if no valid date is found
 *
 * @example
 * getDateFromFileName('report_2024_01_15.pdf', 'yyyy-MM-dd') // '2024-01-15'
 * getDateFromFileName('data_2023_12_25.xlsx', 'MMM dd, yyyy') // 'Dec 25, 2023'
 */
export function getDateFromFileName(
  fileName: string,
  dateFormat: string,
): string | null {
  const fileNameNoExtension = fileName.split(".")[0];

  // get numerical date parts
  const fileNameParts = fileNameNoExtension.split("_");
  const dateValues = fileNameParts.slice(-3);

  // Create a date string in ISO format
  const isoDateString = `${dateValues[0]}-${dateValues[1]}-${dateValues[2]}`;

  try {
    // Parse the ISO date string and format it
    const date = parseISO(isoDateString);
    return format(date, dateFormat);
  } catch {
    // Return null if the date is invalid
    return null;
  }
}
