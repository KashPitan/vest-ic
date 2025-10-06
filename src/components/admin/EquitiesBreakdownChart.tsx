"use client";

import React from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeWithOverlaps } from "@/components/ui/chart-colors";

type Props = {
  equitiesBreakdown: { label: string; value: number }[];
  assetAllocation: { label: string; value: number }[];
  size?: number;
};

const EquitiesBreakdownChart = ({
  equitiesBreakdown,
  assetAllocation,
  size,
}: Props) => {
  const items = equitiesBreakdown ?? [];
  if (!items.length) return null;

  const slices: PieSlice[] = colorizeWithOverlaps(items, {
    overlapAgainst: assetAllocation,
  });

  return (
    <PieChart title="Equities Breakdown (% NAV)" data={slices} size={size} />
  );
};

export default EquitiesBreakdownChart;
