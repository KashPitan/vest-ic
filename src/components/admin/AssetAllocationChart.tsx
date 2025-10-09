"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeBaseOnly } from "@/components/ui/chart-colors";

type Props = {
  allocation: { label: string; value: number }[];
  size?: number;
};

const AssetAllocationChart = ({ allocation, size }: Props) => {
  const slices: PieSlice[] = useMemo(
    () => colorizeBaseOnly(allocation ?? []),
    [allocation],
  );

  if (!slices.length) return null;

  return (
    <PieChart title="Asset Allocation (% NAV)" data={slices} size={size} />
  );
};

export default AssetAllocationChart;
