"use client";

import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export type DonutSlice = { label: string; value: number; color?: string };

type Props = {
  data: DonutSlice[];
  title?: string;
  /** Optional palette to apply if slices don't carry their own `color`. */
  colors?: string[];
  /** Optional size override (px). Default 420. */
  size?: number;
  /** Hide legend if you want. Default true (shows). */
  legend?: boolean;
  className?: string;
};

/** Shared defaults for all pies in the app */
const DEFAULT_SIZE = 420;
const DEFAULT_INNER_RATIO = 0.55;   // consistent hole size
const DEFAULT_GAP_DEGREES = 0.5;    // thin separators
const formatPct = (n: number) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n) + "%";

export default function PieDonut({
  data,
  title,
  colors,
  size = DEFAULT_SIZE,
  legend = true,
  className,
}: Props) {
  // MUI expects radii in px; we keep the same “visual language” everywhere
  const innerRadius = Math.round(size * DEFAULT_INNER_RATIO * 0.45);
  const outerRadius = Math.round(size * 0.45);

  const series = [
    {
      data: data.map((d, i) => ({
        id: i,
        value: d.value,
        label: d.label,
        color: d.color, // if provided by caller, MUI uses it
      })),
      innerRadius,
      outerRadius,
      paddingAngle: DEFAULT_GAP_DEGREES,
      cornerRadius: 0,
      arcLabel: (item: { value: number }) => formatPct(item.value),
      valueFormatter: (item: { value: number }) => formatPct(item.value),
    } as any,
  ];

  return (
    <div className={["flex items-start gap-6", className].filter(Boolean).join(" ")}>
      <div className="shrink-0">
        {title && <div className="mb-2 font-medium">{title}</div>}
        <PieChart
          width={size}
          height={size}
          series={series}
          colors={colors}
          slotProps={{
            legend: legend
              ? {
                  direction: "vertical",
                  position: { vertical: "middle", horizontal: "end" },
                }
              : undefined,
          }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "#fff",
              fontSize: 12,
              fontWeight: 600,
            },
          }}
          aria-label={title ?? "Donut chart"}
        />
      </div>
    </div>
  );
}
