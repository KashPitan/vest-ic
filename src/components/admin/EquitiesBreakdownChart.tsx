"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";

type Props = {
  equitiesBreakdown: { label: string; value: number }[];
  assetAllocation: { label: string; value: number }[];
};

const OVERLAP_PALETTE = [
  "#1E3A8A", // blue-800
  "#2563EB", // blue-600
  "#3B82F6", // blue-500
  "#6366F1", // indigo-500
  "#8B5CF6", // violet-500
  "#4F46E5", // indigo-600
  "#06B6D4", // cyan-500
  "#0EA5E9", // sky-500
  "#14B8A6", // teal-500
  "#60A5FA", // blue-400
  "#93C5FD", // blue-300
  "#A78BFA", // violet-400
  "#22D3EE", // cyan-400
  "#67E8F9", // cyan-300
  "#7C3AED", // violet-600
  "#3730A3", // indigo-800
];

const NON_OVERLAP_PALETTE = [
  "#F59E0B", // amber-500
  "#F97316", // orange-500
  "#EF4444", // red-500
  "#E11D48", // rose-600
  "#DB2777", // pink-600
  "#D946EF", // fuchsia-500
  "#84CC16", // lime-500
  "#22C55E", // green-500
  "#10B981", // emerald-500
  "#65A30D", // lime-600
  "#A3E635", // lime-400
  "#F43F5E", // rose-500
  "#FB923C", // orange-400
  "#FCD34D", // amber-300
  "#CA8A04", // amber-600
  "#F87171", // red-400
];

const EquitiesBreakdownChart = ({
  equitiesBreakdown,
  assetAllocation,
}: Props) => {
  const items = equitiesBreakdown ?? [];
  if (!items.length) return null;

  const overlapSet = new Set(assetAllocation.map((a) => a.label.toLowerCase()));
  let iOverlap = 0;
  let iNon = 0;

  const slices: PieSlice[] = useMemo(
    () =>
      items.map((e) => {
        const isOverlap = overlapSet.has(e.label.toLowerCase());
        return {
          label: e.label,
          value: e.value,
          color: isOverlap
            ? OVERLAP_PALETTE[iOverlap++ % OVERLAP_PALETTE.length]
            : NON_OVERLAP_PALETTE[iNon++ % NON_OVERLAP_PALETTE.length],
        };
      }),
    [items, assetAllocation],
  );

  return <PieChart title="Equities Breakdown (% NAV)" data={slices} />;
};

export default EquitiesBreakdownChart;
