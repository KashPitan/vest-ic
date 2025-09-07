import React from "react";

/**
 * A single slice of the donut chart.
 */
export type DonutSlice = {
  /** Label shown in legend and arc label */
  label: string;
  /** Numeric value (percentage or fraction of total).
   * All values are normalized relative to the dataset total. */
  value: number;
  /** Slice color (CSS color string). */
  color: string;
};

/**
 * Props for the DonutChart component.
 */
export type DonutChartProps = {
  /** Data array of slices (label, value, color). */
  data: DonutSlice[];
  /** Width/height of the SVG in pixels (default: 420). */
  width?: number;
  /** Ratio of inner radius to outer radius (0–1, default: 0.62). */
  innerRatio?: number;
  /** Angular gap between slices in degrees (default: 1.5). */
  gapDegrees?: number;
  /** Stroke color used as a thin separator between slices (default: white). */
  strokeSeparator?: string;
  /** Optional title rendered above the chart. */
  title?: string;
  /** Accessible label for the chart (default: "Donut chart"). */
  ariaLabel?: string;
  /** Whether to show labels inside arcs (default: true). */
  showArcLabels?: boolean;
  /** Whether to show a legend alongside the chart (default: true). */
  showLegend?: boolean;
  /** Function to format numeric values into label strings. */
  labelFormatter?: (n: number) => string;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, ang: number) => [
  cx + r * Math.cos(ang),
  cy + r * Math.sin(ang),
];

/**
 * A simple reusable DonutChart component with optional labels and legend.
 *
 * @example
 * ```tsx
 * <DonutChart
 *   data={[
 *     { label: "Top 10 holdings", value: 53, color: "#1A1549" },
 *     { label: "Rest of portfolio", value: 47, color: "#99103B" },
 *   ]}
 *   title="Top 10 Holdings (% NAV)"
 * />
 * ```
 */
export default function DonutChart({
  data,
  width = 420,
  innerRatio = 0.62,
  gapDegrees = 1.5,
  strokeSeparator = "#ffffff",
  title,
  ariaLabel = "Donut chart",
  showArcLabels = true,
  labelFormatter = (n) =>
    new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n) +
    "%",
  showLegend = true,
}: DonutChartProps) {
  const size = width;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size * 0.9) / 2;
  const innerR = outerR * innerRatio;

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const gap = Math.max(0, Math.min(gapDegrees, 6));

  let cursor = -Math.PI / 2;
  const arcs = data.map((d) => {
    const sweep = ((d.value / total) * 360 * Math.PI) / 180;
    const gapRad = toRad(gap);
    const arcSweep = Math.max(0, sweep - gapRad);
    const start = cursor;
    const end = cursor + arcSweep;
    cursor += sweep;

    const [x0, y0] = polar(cx, cy, outerR, start);
    const [x1, y1] = polar(cx, cy, outerR, end);
    const [xi0, yi0] = polar(cx, cy, innerR, start);
    const [xi1, yi1] = polar(cx, cy, innerR, end);

    const largeArc = arcSweep > Math.PI ? 1 : 0;

    const path = [
      `M ${x0} ${y0}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x1} ${y1}`,
      `L ${xi1} ${yi1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi0} ${yi0}`,
      "Z",
    ].join(" ");

    const mid = start + arcSweep / 2;
    const [lx, ly] = polar(cx, cy, (outerR + innerR) / 2, mid);

    return { d, path, labelPos: { x: lx, y: ly } };
  });

  return (
    <div className="flex items-start gap-6">
      <div className="shrink-0">
        {title && <div className="mb-2 font-medium">{title}</div>}

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={ariaLabel}
        >
          <g>
            {arcs.map((a, i) => (
              <path
                key={i}
                d={a.path}
                fill={a.d.color}
                stroke={strokeSeparator}
                strokeWidth={2}
              />
            ))}
            {showArcLabels &&
              arcs.map((a, i) => (
                <text
                  key={`lbl-${i}`}
                  x={a.labelPos.x}
                  y={a.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs font-medium"
                >
                  {labelFormatter(a.d.value)}
                </text>
              ))}
          </g>
        </svg>
      </div>

      {showLegend && (
        <div
          className={`flex flex-col gap-1 ${
            title ? "mt-32" : "mt-1.5"
          } text-sm text-neutral-900 font-sans`}
        >
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: d.color }}
              />
              <span>
                {d.label} {labelFormatter(d.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
