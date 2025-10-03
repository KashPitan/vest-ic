"use client";

import * as React from "react";
import { PieChart as MuiPieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export type PieSlice = { label: string; value: number; color?: string };

type Props = {
  /**
   * Data slices, each with label, value, and optional color
   */
  data: PieSlice[];
  /**
   * Optional title above the chart
   */
  title?: string;
  /**
   * Optional palette to apply if slices don't carry their own `color`
   */
  colors?: string[];
  /**
   * Optional size override (px). Default 420
   */
  size?: number;
  /**
   * Show legend
   */
  showLegend?: boolean;
  /**
   * Optional additional class names for the container
   */
  className?: string;
};

// Shared defaults for all pies in the app
const DEFAULT_SIZE = 320
const DEFAULT_INNER_RATIO = 0.55; // hole size
const DEFAULT_GAP_DEGREES = 0.5;  // thin separators

const formatPct = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n) + "%";

const isTrueZero = (n: unknown) => Number(n) === 0;

const PieChart = ({
  data,
  title,
  colors,
  size = DEFAULT_SIZE,
  showLegend = true,
  className,
}: Props) => {
  // Hide true zeros - keep tiny >0 values (will show as 0.0%)
  const cleanedData = (data ?? []).filter((d) => !isTrueZero(d.value));

  // If everything was zero, show nothing
  if (cleanedData.length === 0) return null;

  const innerRadius = Math.round(size * DEFAULT_INNER_RATIO * 0.45);
  const outerRadius = Math.round(size * 0.45);

  const series = [
    {
      data: cleanedData.map((d, i) => ({
        id: i,
        value: d.value,
        label: d.label,
        color: d.color,
      })),
      innerRadius,
      outerRadius,
      paddingAngle: DEFAULT_GAP_DEGREES,
      cornerRadius: 0,
      arcLabel: (item: { value: number }) => formatPct(item.value),
      // hide arc label if the visual slice is too small
      arcLabelMinAngle: 8,
      valueFormatter: (item: { value: number }) => formatPct(item.value),
    },
  ];

  // Right-aligned, vertical legend on the right, vertically centred
  const legendSlot = showLegend
    ? {
        direction: "vertical" as const,
        position: { vertical: "middle" as const, horizontal: "end" as const },
        labelStyle: { fontSize: 12, textAlign: "right" as const },
      }
    : undefined;

  return (
    <div className={["flex items-start gap-6", className].filter(Boolean).join(" ")}>
      <div className="shrink-0">
        {title && <h2 className="mb-2 text-lg font-medium">{title}</h2>}
        <div className="py-10">
          <MuiPieChart
            width={size}
            height={size}
            series={series}
            colors={colors}
            slotProps={{
              legend: legendSlot,
            }}
            sx={{
              // Make arc labels readable on any color
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "#fff",
                fontSize: 12,
                fontWeight: 700,
                paintOrder: "stroke fill",
                stroke: "rgba(17,24,39,.7)",
                strokeWidth: 2, // dark outline for contrast
              },
            }}
            aria-label={title ?? "Pie chart"}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
