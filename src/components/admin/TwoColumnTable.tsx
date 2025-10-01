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

interface TwoColumnTableProps {
  data: KeyValuePairData;
  textSize?: FontSize2;
  white?: boolean;
}

export default function TwoColumnTable({
  data,
  textSize,
  white = false,
}: TwoColumnTableProps) {
  return (
    <Table
      className={`${articulat.className} ${textSize && fontSize[textSize]} ${white ? "text-white" : ""}`}
    >
      <TableHeader>
        <TableRow>
          <TableHead>{data[0][0]}</TableHead>
          <TableHead>{data[0][1]}</TableHead>
        </TableRow>
      </TableHeader>
      {/* table body ignores the first row as its used for the header */}
      <TableBody>
        {data.slice(1).map(([a, b], idx) => (
          <TableRow key={idx}>
            <TableCell>{a}</TableCell>
            <TableCell>{b}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
