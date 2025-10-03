"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { BASE_PALETTE } from "@/components/ui/chart-colors";

type Props = { allocation: { label: string; value: number }[] };

const AssetAllocationChart = ({ allocation }: Props) => {
  const slices: PieSlice[] = useMemo(
    () =>
      (allocation ?? []).map((a, i) => ({
        label: a.label,
        value: a.value,
        color: BASE_PALETTE[i % BASE_PALETTE.length],
      })),
    [allocation],
  );

  if (!slices.length) return null;

  return <PieChart title="Asset Allocation (% NAV)" data={slices} />;
};

export default AssetAllocationChart;
