"use client";

import React, { useMemo } from "react";
import PieDonut, { type DonutSlice } from "@/components/ui/pie-chart";

type Props = {
  holdings: { label: string; value: number }[];
};

const NAVY = "#1A1549";
const BURGUNDY = "#99103B";

export default function TopHoldingsChart({ holdings }: Props) {
  const slices: DonutSlice[] = useMemo(
    () =>
      (holdings ?? []).map((h) => ({
        label: h.label,
        value: h.value,
        color: h.label.toLowerCase().includes("rest") ? BURGUNDY : NAVY,
      })),
    [holdings],
  );

  if (!slices.length) return null;

  return <PieDonut title="Top 10 Holdings (% NAV)" data={slices} />;
}
