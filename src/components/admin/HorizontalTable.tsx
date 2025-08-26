import React from "react";
import { TwoColumnData } from "@/app/(admin)/admin/excel/utils";
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
  data: TwoColumnData;
  textSize?: FontSize2;
}

export default function HorizontalTable({
  data,
  textSize,
}: HorizontalTableProps) {
  // Transpose the data so columns become rows
  const transposedData =
    data[0]?.map((_, colIndex) => data.map((row) => row[colIndex])) || [];

  return (
    <Table
      className={`${articulat.className} ${textSize && fontSize[textSize]}`}
    >
      <TableHeader>
        <TableRow>
          {data.map((row, idx) => (
            <TableHead key={idx}>{row[0]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transposedData.slice(1, 2).map((column, colIdx) => (
          <TableRow key={colIdx}>
            {column.map((value, rowIdx) => (
              <TableCell key={rowIdx}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
