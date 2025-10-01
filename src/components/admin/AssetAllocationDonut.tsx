"use client";

import React, { useMemo } from "react";
import PieDonut, { type DonutSlice } from "@/components/ui/pie-chart";

type Props = {
  /** From getAllChartData().assetAllocation */
  allocation: { label: string; value: number }[];
};

// Simple palette (customize to your brand if needed)
const PALETTE = [
  "#1A1549",
  "#99103B",
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F43F5E",
];

export default function AssetAllocationDonut({ allocation }: Props) {
  const slices: DonutSlice[] = useMemo(
    () =>
      (allocation ?? []).map((a, i) => ({
        label: a.label,
        value: a.value,
        color: PALETTE[i % PALETTE.length],
      })),
    [allocation],
  );

  if (!slices.length) return null;

  return <PieDonut title="Asset Allocation (% NAV)" data={slices} />;
}

// import React, { useMemo } from "react";
// import DonutChart, { DonutSlice } from "../ui/donut-chart";

// const ASSET_ALLOC_PALETTE = [
//   "#1A1549",
//   "#99103B",
//   "#2563EB",
//   "#16A34A",
//   "#F59E0B",
//   "#EF4444",
//   "#8B5CF6",
//   "#06B6D4",
//   "#84CC16",
//   "#F43F5E",
// ];

// const formatPct = (n: number) =>
//   new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n) + "%";

// type AssetAllocationDonutProps = {
//   allocation: { label: string; value: number }[];
//   title?: string;
// };

// export default function AssetAllocationDonut({
//   allocation,
//   title = "Asset allocation",
// }: AssetAllocationDonutProps) {
//   const slices: DonutSlice[] = useMemo(() => {
//     return (allocation ?? []).map((a, i) => ({
//       label: a.label,
//       value: a.value,
//       color: ASSET_ALLOC_PALETTE[i % ASSET_ALLOC_PALETTE.length],
//     }));
//   }, [allocation]);

//   if (!slices.length) return null;

//   return (
//     <DonutChart
//       data={slices}
//       width={420}
//       innerRatio={0.55}
//       gapDegrees={0.5}
//       strokeSeparator="#ffffff"
//       title={title}
//       ariaLabel="Asset allocation share"
//       showArcLabels={true}
//       labelFormatter={formatPct}
//       showLegend={true}
//     />
//   );
// }
