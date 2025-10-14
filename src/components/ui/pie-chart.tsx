"use client";

import * as React from "react";
import { PieChart as MuiPieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export interface PieSlice {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

export interface PieChartProps {
  /**
   * Data slices, each with label, value, and optional color
   */
  data: readonly PieSlice[];
  /**
   * Optional title above the chart
   */
  title?: string;
  /**
   * Optional palette to apply if slices don't carry their own `color`
   */
  colors?: readonly string[];
  /**
   * Optional size override (px). Default 320
   */
  size?: number;
  /**
   * Whether to show the legend. Default true
   */
  showLegend?: boolean;
  /**
   * Sort slices by value. Default: undefined (no sort)
   */
  sortByValue?: 'asc' | 'desc';
  /**
   * Optional additional class names for the container
   */
  className?: string;
}

// Shared defaults for all pies in the app
const DEFAULT_SIZE = 320 as const;
const DEFAULT_INNER_RATIO = 0.55 as const; // hole size
const DEFAULT_GAP_DEGREES = 0.5 as const;  // thin separators
const MIN_ARC_LABEL_ANGLE = 8 as const;    // hide arc label if slice too small
const ARC_LABEL_FONT_SIZE = 12 as const;
const LEGEND_FONT_SIZE = 12 as const;
const ARC_LABEL_STROKE_WIDTH = 2 as const;

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
  sortByValue,
  className,
}: PieChartProps) => {
  // Hide true zeros - keep tiny >0 values (will show as 0.0%)
  const cleanedData = React.useMemo(() => {
    const base = (data ?? []).filter((s) => !isTrueZero(s.value));
    if (!sortByValue) return base;

    // stable sort (keep original order for ties)
    return base
      .map((d, i) => ({ d, i }))
      .sort((a, b) => {
        const diff = a.d.value - b.d.value;
        if (diff === 0) return a.i - b.i;
        return sortByValue === 'asc' ? diff : -diff;
      })
      .map(({ d }) => d);
  }, [data, sortByValue]);

  // If everything was zero, show nothing
  if (cleanedData.length === 0) return null;

  const innerRadius = Math.round(size * DEFAULT_INNER_RATIO * 0.45);
  const outerRadius = Math.round(size * 0.45);

  const series = [
    {
      data: cleanedData.map((slice, index) => ({
        id: index,
        value: slice.value,
         label: `${slice.label} ${formatPct(slice.value)}`,
        color: slice.color,
      })),
      innerRadius,
      outerRadius,
      paddingAngle: DEFAULT_GAP_DEGREES,
      cornerRadius: 0,
      arcLabel: (item: { value: number }) => item.value >= 5 ? formatPct(item.value) : "",
      // hide arc label if the visual slice is too small
      arcLabelMinAngle: MIN_ARC_LABEL_ANGLE,
      valueFormatter: (item: { value: number }) => formatPct(item.value),
    },
  ];

  // Right-aligned, vertical legend on the right, vertically centred
  const legendSlot = showLegend
    ? {
        direction: "vertical" as const,
        position: { vertical: "middle" as const, horizontal: "end" as const },
        labelStyle: { fontSize: LEGEND_FONT_SIZE, textAlign: "right" as const },
      }
    : undefined;

  return (
  <div className={["flex flex-col h-full", className].filter(Boolean).join(" ")}>
    {title && <h2 className="mb-2 text-lg font-medium">{title}</h2>}

    <div className="flex-1 flex items-center justify-center py-5">
      <MuiPieChart
        width={size}
        height={size}
        series={series}
        colors={colors ? [...colors] : undefined}
        slotProps={{ legend: legendSlot }}
        sx={{
          // Make arc labels readable on any color
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "#fff",
            fontSize: ARC_LABEL_FONT_SIZE,
            fontWeight: 700,
            paintOrder: "stroke fill",
            stroke: "rgba(17,24,39,.7)",
            strokeWidth: ARC_LABEL_STROKE_WIDTH, // dark outline for contrast
          },
        }}
        aria-label={title ?? "Pie chart"}
      />
    </div>
  </div>
);
};

export default PieChart;
