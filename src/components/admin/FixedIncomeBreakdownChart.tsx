"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeSinglePalette } from "@/components/ui/chart-colors";

type Props = {
  fixedIncomeBreakdown: { label: string; value: number }[];
  assetAllocation: { label: string; value: number }[];
};

export default function FixedIncomeBreakdownChart({
  fixedIncomeBreakdown,
  assetAllocation,
}: Props) {
  const items = fixedIncomeBreakdown ?? [];
  if (!items.length) return null;

  const slices: PieSlice[] = useMemo(
    () => colorizeSinglePalette(items, { overlapAgainst: assetAllocation }),
    [items, assetAllocation],
  );

  return <PieChart title="Fixed Income Breakdown (% NAV)" data={slices} />;
}
