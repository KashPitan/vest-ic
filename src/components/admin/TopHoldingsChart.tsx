"use client";

import React, { useMemo } from "react";
import PieChart, { type PieSlice } from "@/components/ui/pie-chart";
import { colorizeBaseOnly } from "@/components/ui/chart-colors";

type Props = {
  holdings: { label: string; value: number }[];
  size?: number;
};

const TopHoldingsChart = ({ holdings, size }: Props) => {
  const slices: PieSlice[] = useMemo(
    () => colorizeBaseOnly(holdings ?? []),
    [holdings],
  );

  if (!slices.length) return null;

  return <PieChart title="Top 10 Holdings (% NAV)" data={slices} size={size} />;
};

export default TopHoldingsChart;
