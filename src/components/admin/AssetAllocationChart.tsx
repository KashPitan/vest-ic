"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";

type Props = {
  /**
   * Asset allocation breakdown (% NAV)
   */
  allocation: { label: string; value: number }[];
};

const PALETTE = [
  "#1A1549",
  "#99103B",
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F43F5E",
];

const AssetAllocationChart = ({ allocation }: Props) => {
  const slices: PieSlice[] = useMemo(
    () =>
      (allocation ?? []).map((a, i) => ({
        label: a.label,
        value: a.value,
        color: PALETTE[i % PALETTE.length],
      })),
    [allocation],
  );

  if (!slices.length) return null;

  return <PieChart title="Asset Allocation (% NAV)" data={slices} />;
};

export default AssetAllocationChart;
