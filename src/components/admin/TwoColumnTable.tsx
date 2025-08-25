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

interface TwoColumnTableProps {
  data: TwoColumnData;
}

export default function TwoColumnTable({ data }: TwoColumnTableProps) {
  return (
    <Table className={`${articulat.className}`}>
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
