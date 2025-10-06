"use client";

import React from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeWithOverlaps } from "@/components/ui/chart-colors";

type Props = {
  fixedIncomeBreakdown: { label: string; value: number }[];
  assetAllocation: { label: string; value: number }[];
};

const FixedIncomeBreakdownChart = ({
  fixedIncomeBreakdown,
  assetAllocation,
}: Props) => {
  const items = fixedIncomeBreakdown ?? [];
  if (!items.length) return null;

  const slices: PieSlice[] = colorizeWithOverlaps(items, {
    overlapAgainst: assetAllocation,
  });

  return <PieChart title="Fixed Income Breakdown (% NAV)" data={slices} />;
};

export default FixedIncomeBreakdownChart;
