import React from "react";
import { KeyValuePairData } from "@/app/(admin)/admin/excel/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { articulat } from "@/fonts";

type FontSize2 = "xs" | "xl";

const fontSize: Record<FontSize2, string> = {
  xs: "text-xs",
  xl: "text-xl",
};

interface HorizontalTableProps {
  data: KeyValuePairData;
  textSize?: FontSize2;
  secondHeaderText?: string;
  emptyStateText?: string;
  classNames?: string;
  white?: boolean;
}

interface HorizontalTableRowsProps {
  data: string[][];
  textSize?: FontSize2;
  headerText?: string;
  emptyStateText?: string;
  classNames?: string;
  white?: boolean;
}

export default function HorizontalTable({
  data,
  textSize,
  secondHeaderText,
  emptyStateText,
  classNames = "",
  white = false,
}: HorizontalTableProps) {
  // Transpose the data so columns become rows
  const transposedData =
    data[0]?.map((_, colIndex) => data.map((row) => row[colIndex])) || [];

  const isEmptyValues = data.every((pair) => pair[1] === "");
  const showEmptyState = isEmptyValues && emptyStateText;

  return (
    <Table
      className={`${articulat.className} ${textSize && fontSize[textSize]} ${white ? "text-white" : ""} ${classNames}`}
    >
      {secondHeaderText && (
        <TableHeader className="border-b">
          <TableHead className={` ${white ? "text-white" : ""}`}>
            {secondHeaderText}
          </TableHead>
        </TableHeader>
      )}
      <TableHeader>
        <TableRow>
          {data.map((row, idx) => (
            <TableHead key={idx}>{row[0]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {showEmptyState ? (
        <TableHeader className="border-b">
          <TableHead>{emptyStateText}</TableHead>
        </TableHeader>
      ) : (
        <TableBody>
          {transposedData.slice(1, 2).map((column, colIdx) => (
            <TableRow key={colIdx}>
              {column.map((value, rowIdx) => (
                <TableCell key={rowIdx}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

export function HorizontalTableRows({
  data,
  textSize,
  headerText,
  emptyStateText,
  classNames = "",
  white = false,
}: HorizontalTableRowsProps) {
  const isEmpty =
    data.length === 0 || data.every((row) => row.every((cell) => cell === ""));
  const showEmptyState = isEmpty && emptyStateText;

  return (
    <>
      {headerText && (
        <TableHeader className="border-b">
          <TableHead>{headerText}</TableHead>
        </TableHeader>
      )}
      <Table
        className={`${articulat.className} ${textSize && fontSize[textSize]} ${white ? "text-white" : ""} ${classNames}`}
      >
        {showEmptyState ? (
          <TableHeader className="border-b">
            <TableHead className={` ${white ? "text-white" : ""}`}>
              {emptyStateText}
            </TableHead>
          </TableHeader>
        ) : (
          <TableBody>
            {data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <TableCell key={cellIdx}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  );
}
