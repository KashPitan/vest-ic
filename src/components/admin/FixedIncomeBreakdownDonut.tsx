"use client";

import React, { useMemo } from "react";
import PieDonut, { type DonutSlice } from "@/components/ui/pie-chart";

type Props = {
  fixedIncomeBreakdown: { label: string; value: number }[];
};

// Fixed palettes depending on number of slices
const PALETTES_BY_COUNT: Record<number, string[]> = {
  2: ["#1A1549", "#99103B"],
  3: ["#1A1549", "#2563EB", "#8B5CF6"],
  4: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B"],
  5: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B", "#EF4444"],
  6: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6"],
};

function pickPalette(count: number): string[] {
  return PALETTES_BY_COUNT[count] ?? PALETTES_BY_COUNT[6]!;
}

export default function FixedIncomeBreakdownDonut({
  fixedIncomeBreakdown,
}: Props) {
  const items = fixedIncomeBreakdown ?? [];
  if (!items.length) return null;

  const palette = pickPalette(items.length);

  const slices: DonutSlice[] = useMemo(
    () =>
      items.map((e, i) => ({
        label: e.label,
        value: e.value,
        color: palette[i % palette.length],
      })),
    [items, palette],
  );

  return <PieDonut title="Fixed Income Breakdown (% NAV)" data={slices} />;
}
