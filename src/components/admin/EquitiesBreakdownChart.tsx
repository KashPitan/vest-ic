"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeSinglePalette } from "@/components/ui/chart-colors";

type Props = {
  equitiesBreakdown: { label: string; value: number }[];
  assetAllocation: { label: string; value: number }[];
};

const EquitiesBreakdownChart = ({
  equitiesBreakdown,
  assetAllocation,
}: Props) => {
  const items = equitiesBreakdown ?? [];
  if (!items.length) return null;

  const slices: PieSlice[] = useMemo(
    () => colorizeSinglePalette(items, { overlapAgainst: assetAllocation }),
    [items, assetAllocation],
  );

  return <PieChart title="Equities Breakdown (% NAV)" data={slices} />;
};

export default EquitiesBreakdownChart;
