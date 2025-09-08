import React, { useMemo } from "react";
import DonutChart, { DonutSlice } from "../ui/donut-chart";

type FixedIncomeBreakdownDonutProps = {
  /** Slices from the Fixed Income Breakdown tab (already normalized to %). */
  fixedIncomeBreakdown: { label: string; value: number }[];
  title?: string;
};

const formatPct = (n: number) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n) + "%";

/**
 * Fixed palettes keyed by the number of segments.
 * Use the first N colors for N slices. Tweak hexes to your brand.
 */
const PALETTES_BY_COUNT: Record<number, readonly string[]> = {
  2: ["#1A1549", "#99103B"],
  3: ["#1A1549", "#2563EB", "#8B5CF6"],
  4: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B"],
  5: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B", "#EF4444"],
  6: ["#1A1549", "#2563EB", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6"],
  7: [
    "#1A1549",
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ],
  8: [
    "#1A1549",
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
  ],
  9: [
    "#1A1549",
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F43F5E",
  ],
  10: [
    "#1A1549",
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F43F5E",
    "#A855F7",
  ],
};

function choosePalette(count: number): string[] {
  const p = PALETTES_BY_COUNT[count] ?? PALETTES_BY_COUNT[10]!;
  return Array.from(p).slice(0, Math.min(count, p.length));
}

export default function FixedIncomeBreakdownDonut({
  fixedIncomeBreakdown,
  title = "Fixed income breakdown (% NAV)",
}: FixedIncomeBreakdownDonutProps) {
  const items = fixedIncomeBreakdown ?? [];
  if (!items.length) return null;

  const palette = useMemo(() => choosePalette(items.length), [items.length]);

  const slices: DonutSlice[] = items.map((e, i) => ({
    label: e.label,
    value: e.value,
    color: palette[i % palette.length],
  }));

  return (
    <DonutChart
      data={slices}
      width={420}
      innerRatio={0.55}
      gapDegrees={0.5}
      strokeSeparator="#ffffff"
      title={title}
      ariaLabel="Fixed income breakdown as a share of NAV"
      showArcLabels={true}
      labelFormatter={formatPct}
      showLegend={true}
    />
  );
}
