import React, { useMemo } from "react";
import DonutChart, { DonutSlice } from "../ui/donut-chart";

const NAVY = "#1A1549";
const BURGUNDY = "#99103B";

// Shared percent formatter: 1 decimal + %
const formatPct = (n: number) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n) + "%";

type TopHoldingsChartProps = {
  holdings: { label: string; value: number }[];
};

export default function TopHoldingsChart({ holdings }: TopHoldingsChartProps) {
  const slices: DonutSlice[] = useMemo(() => {
    return (holdings ?? []).map((h) => ({
      label: h.label,
      value: h.value,
      color: h.label.toLowerCase().includes("rest") ? BURGUNDY : NAVY,
    }));
  }, [holdings]);

  if (!slices.length) return null;

  return (
    <DonutChart
      data={slices}
      width={420}
      innerRatio={0.55}
      gapDegrees={0.2}
      strokeSeparator="#ffffff"
      title="Top 10 Holdings (% NAV)"
      ariaLabel="Top 10 holdings as a share of NAV"
      showArcLabels={true}
      labelFormatter={formatPct}
      showLegend={true}
    />
  );
}
